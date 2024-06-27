import { Octokit } from "octokit";
import "dotenv/config";
import {
  CreateBranchArgs,
  CreateFileArgs,
  CreatePullRequestArgs,
  GetUserArgs,
} from "../types/registry-repo";
import { getTappManifest } from "./get-tapp-data";
import { addImagesToRegistry } from "./add-images";
import path from "path";

import {
  BASE_BRANCH,
  MANIFEST_FILE,
  REGISTRY_OWNER,
  SRC_DIR,
  TAPPLET_REGISTRY_REPO,
  VER_DIR,
} from "../constants";

async function getAuthenticatedUser({ octokit }: GetUserArgs) {
  try {
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  } catch (err) {
    throw err;
  }
}

async function createBranch({
  octokit,
  owner,
  repo,
  branchName,
  baseBranchName,
}: CreateBranchArgs) {
  try {
    const baseBranchSha = (
      await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch: baseBranchName,
      })
    ).data.commit.sha;

    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: baseBranchSha,
    });
    return branchName;
  } catch (error) {
    throw error;
  }
}

async function createFile({
  octokit,
  owner,
  repo,
  filePath,
  fileContent,
  branchName,
}: CreateFileArgs) {
  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Add ${filePath}`,
      content: fileContent,
      branch: branchName,
    });
    return filePath;
  } catch (error) {
    throw error;
  }
}

async function createPullRequest({
  octokit,
  owner,
  branchName,
  repo = TAPPLET_REGISTRY_REPO,
  base = BASE_BRANCH,
  prTitle,
}: CreatePullRequestArgs) {
  const title = prTitle ?? `${branchName}`;

  try {
    const pr = await octokit.rest.pulls.create({
      owner,
      repo,
      base,
      title,
      head: branchName,
    });
    return pr;
  } catch (err) {
    throw err;
  }
}

export async function initOctokitAndGetAuthUser() {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    throw new Error("Registration error: github access token not found");
  }
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const user = await getAuthenticatedUser({ octokit });
  return user;
}

export async function registerTapp() {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    throw new Error("Registration error: github access token not found");
  }
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  // TODO adjust here the tapp-registry owner
  const owner = REGISTRY_OWNER;
  if (!owner) {
    throw new Error("Registration error: owner not found");
  }

  const user = await getAuthenticatedUser({ octokit });
  const tappletManifest = getTappManifest();

  const branchName = `${tappletManifest.packageName}@${tappletManifest.version}`;
  console.log(`Branch name: ${branchName}`);
  console.log(`Branch created by: ${user.login}`);
  try {
    const createdBranch = await createBranch({
      octokit,
      owner,
      repo: TAPPLET_REGISTRY_REPO,
      branchName,
      baseBranchName: BASE_BRANCH,
    });
    console.log(`Branch created: ${createdBranch}`);
  } catch (error) {
    console.log(`Branch not created!`);
    throw error;
  }

  try {
    const filePath = path.join(
      SRC_DIR,
      tappletManifest.packageName,
      VER_DIR,
      tappletManifest.version,
      MANIFEST_FILE
    );
    const manifestFileContent = Buffer.from(
      JSON.stringify(tappletManifest)
    ).toString("base64");

    await createFile({
      octokit,
      owner,
      repo: TAPPLET_REGISTRY_REPO,
      filePath,
      fileContent: manifestFileContent,
      branchName,
    });
  } catch (error) {
    throw error;
  }

  try {
    await addImagesToRegistry(
      tappletManifest.packageName,
      owner,
      branchName,
      octokit
    );
  } catch (error) {
    throw error;
  }

  try {
    const pr = await createPullRequest({ octokit, owner, branchName });
    console.log("PR created with data", pr);
  } catch (error) {
    throw error;
  }
}
