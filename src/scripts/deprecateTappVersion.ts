import { getTappManifest } from "../helpers/index.js";
import { select } from "@inquirer/prompts";
import { versionPattern } from "../types/tapplet.js";
import {
  BASE_BRANCH,
  MANIFEST_FILE,
  REGISTRY_OWNER,
  SRC_DIR,
  TAPPLET_REGISTRY_REPO,
  VER_DIR,
} from "../constants.js";
import path from "path";
import { getSha } from "./addImages.js";
import {
  createBranch,
  createPullRequest,
  initOctokitAndGetAuthUser,
} from "../helpers/repo.js";

export async function deprecateTappVersion(version: string) {
  if (!versionPattern.test(version)) throw new Error("Version not valid");

  // get current manifest file
  let manifest = getTappManifest();
  manifest.version = version;

  manifest.status = await select({
    message: "Set the project status as deprecated",
    choices: [
      {
        name: "deprecated",
        value: "DEPRECATED",
        description: "Tapplet version is deprecated",
      },
    ],
  });

  const { octokit } = await initOctokitAndGetAuthUser();
  const owner = REGISTRY_OWNER;
  if (!owner) {
    throw new Error("Registration error: owner not found");
  }

  // note: branch name needs to be exactly like this for github workflows
  const branchName = `${manifest.packageName}@${manifest.version}@DEPRECATED`;
  const filePath = path.join(
    SRC_DIR,
    manifest.packageName,
    VER_DIR,
    manifest.version,
    MANIFEST_FILE
  );
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
    const manifestSha = await getSha(owner, filePath, octokit);
    const manifestFileContent = Buffer.from(JSON.stringify(manifest)).toString(
      "base64"
    );
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo: TAPPLET_REGISTRY_REPO,
      path: filePath,
      message: `Deprecate ${manifest.version}`,
      content: manifestFileContent,
      branch: branchName,
      sha: manifestSha,
    });
  } catch (error) {
    throw error;
  }

  // create PR to deprecate version
  try {
    const pr = await createPullRequest({ octokit, owner, branchName });
    console.log("PR created with data", pr);
  } catch (error) {
    throw error;
  }
}