import input from "@inquirer/input";
import confirm from "@inquirer/confirm";

import select from "@inquirer/select";
import { createManifest } from "./create-manifest.js";
import { getTappManifest } from "./get-tapp-data.js";
import { initOctokitAndGetAuthUser, registerTapp } from "./register-tapp.js";
import { Manifest } from "../types/manifest.js";

export async function initTapp() {
  const user = await initOctokitAndGetAuthUser();

  let manifest: Manifest = {
    packageName: "",
    version: "",
    displayName: "",
    status: "",
    category: "",
    author: {
      name: "",
      website: "",
    },
    about: {
      summary: "",
      description: "",
    },
    design: {
      logoPath: "",
      backgroundPath: "",
    },
    repository: {
      type: "git",
      url: "",
      codeowners: [],
    },
    source: {
      location: {
        npm: {
          packageName: "",
          registry: "",
          distTarball: "",
          integrity: "",
        },
      },
    },
    manifestVersion: "",
  };

  manifest.packageName = await input({
    message: "Enter tapplet name",
    default: "tapplet",
  });

  manifest.version = await input({
    message: "Enter tapplet version",
    default: "1.0.0",
  });

  manifest.displayName = await input({
    message: "Enter tapplet display name",
    default: "The Tapplet description",
  });

  manifest.status = await select({
    message: "Select the project status",
    choices: [
      {
        name: "mvp",
        value: "MVP",
        description: "A minimum viable product",
      },
      {
        name: "test",
        value: "TEST",
        description: "Tapplet is in the test phase",
      },
      {
        name: "prod",
        value: "PROD",
        description: "Tapplet is ready to be used",
      },
      {
        name: "deprecated",
        value: "DEPRECATED",
        description: "Tapplet version is deprecated",
      },
    ],
  });

  manifest.category = await select({
    message: "Select the tapplet category",
    choices: [
      {
        name: "defi",
        value: "DEFI",
        description: "Defi",
      },
      {
        name: "nft",
        value: "NFT",
        description: "NFT",
      },
      {
        name: "user",
        value: "USER",
        description: "User",
      },
      {
        name: "other",
        value: "OTHER",
        description: "other",
      },
    ],
  });

  manifest.author.name = await input({
    message: "Enter author's name",
    default: user.login,
  });
  manifest.author.website = await input({
    message: "Enter author's website",
    default: user.repos_url,
  });

  manifest.about.summary = await input({
    message: "Enter short summary",
  });
  manifest.about.description = await input({
    message: "Enter long summary",
  });

  const isCopyingAccepted = await confirm({
    message:
      "Do you want to copy logo and background images to the Tapplets Registry?",
  });
  if (isCopyingAccepted) {
    manifest.design.logoPath = await input({
      message: "Enter logo image path",
      default: "src/images/logo.svg",
    });

    manifest.design.backgroundPath = await input({
      message: "Enter background image path",
      default: "src/images/background.svg",
    });

    console.log("Cool, now images should be copied!");
  }
  manifest.source.location.npm.packageName = manifest.packageName;
  manifest.source.location.npm.registry = await input({
    message: "Enter registry url",
    default: "https://registry.npmjs.org/",
  });
  manifest.source.location.npm.distTarball = await input({
    message: "Enter package tarball url",
    default: `https://registry.npmjs.org/${manifest.packageName}/-/${manifest.packageName}-${manifest.version}.tgz`,
  });
  manifest.source.location.npm.integrity = await input({
    message: "Enter npm package integrity",
    default: "sha512-...",
  });
  manifest.manifestVersion = await input({
    message: "Enter tapplet manifest version",
    default: "1.0.0",
  });

  createManifest(manifest);
  console.log("About to create manifest");
  console.log(manifest);
  const isManifestAccepted = await confirm({
    message: "Is this OK?",
  });

  if (isManifestAccepted) {
    const isRegistrationAccepted = await confirm({
      message: "Manifest created. Register the tapplet now?",
    });

    if (isRegistrationAccepted) {
      console.log("\x1b[42m%s\x1b[0m", "Registration process has started!");
      const tappletManifest = getTappManifest();
      console.log("Tapplet manifest version:", tappletManifest.version);
      await registerTapp();
    } else {
      console.log(
        "\x1b[42m%s\x1b[0m",
        "Manifest created successfully! To register the tapplet use 'tapp-registrant -r'"
      );
    }
  } else {
    console.log(
      "\x1b[42m%s\x1b[0m",
      "The manifest has been created but must be corrected manually before registration"
    );
  }
}
