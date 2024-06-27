import { Octokit } from "octokit";
import path from "path";
import fs from "fs";
import { IMAGES_DIR, SRC_DIR, TAPPLET_REGISTRY_REPO } from "../constants";

export async function addImagesToRegistry(
  packageName: string,
  owner: string,
  branchName: string,
  octokit: Octokit
) {
  const imagesPathLocal = path.join(SRC_DIR, IMAGES_DIR);
  const logoPathTappRegistry = path.join(SRC_DIR, packageName, IMAGES_DIR);

  const logoFile = path.join(imagesPathLocal, "logo.svg");
  const logoFileRegistry = path.join(logoPathTappRegistry, "logo.svg");
  // Convert to base64-encoded string
  const imageBase64 = fs.readFileSync(logoFile).toString("base64");
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: TAPPLET_REGISTRY_REPO,
    path: logoFileRegistry,
    message: `Add logo image`,
    content: imageBase64,
    branch: branchName,
  });

  const bgFile = path.join(imagesPathLocal, "background.svg");
  const bgFileRegistry = path.join(logoPathTappRegistry, "background.svg");
  const bgBase64 = fs.readFileSync(bgFile).toString("base64");
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: TAPPLET_REGISTRY_REPO,
    path: bgFileRegistry,
    message: `Add background image`,
    content: bgBase64,
    branch: branchName,
  });
}
