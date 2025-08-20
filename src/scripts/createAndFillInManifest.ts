import { registerTapp } from "./registerTapp.js"
import { initOctokitAndGetAuthUser } from "../helpers/repo.js"
import {
  getAuthorName,
  getAuthorWebsite,
  getBackgroundPath,
  getCategory,
  getCodeowners,
  getConfirmation,
  getDescription,
  getDisplayName,
  getDistTarball,
  getIntegrity,
  getLogoPath,
  getManifestVersion,
  getPackageName,
  getPackageVersion,
  getPermissions,
  getRegistryUrl,
  getStatus,
  getSummary,
  getSupportedChains,
} from "../helpers/cli.js"
import { getPackageJson, writeManifestFile } from "../helpers/readWriteJson.js"
import { writeEmptyManifest } from "./writeEmptyManifest.js"
import { getPackageDist } from "./getPackageDist.js"

export async function createAndFillInManifest() {
  try {
    const { user } = await initOctokitAndGetAuthUser()

    const packageJson = getPackageJson()
    const manifest = writeEmptyManifest()
    const packageDist = await getPackageDist()

    manifest.packageName = await getPackageName(packageJson.name)
    manifest.version = await getPackageVersion(packageJson.version)
    manifest.displayName = await getDisplayName()
    manifest.status = await getStatus()
    manifest.category = await getCategory()
    manifest.author.name = await getAuthorName(packageJson.author)
    manifest.author.website = await getAuthorWebsite(user.repos_url)
    manifest.about.summary = await getSummary()
    manifest.about.description = await getDescription()
    manifest.design.logoPath = await getLogoPath()
    manifest.design.backgroundPath = await getBackgroundPath()
    manifest.repository.codeowners = await getCodeowners(user.login)
    manifest.source.location.npm.packageName = manifest.packageName
    manifest.source.location.npm.registry = await getRegistryUrl()
    manifest.source.location.npm.distTarball = await getDistTarball(packageDist.tarball)
    manifest.source.location.npm.integrity = await getIntegrity(packageDist.integrity)
    manifest.supportedChain = await getSupportedChains()
    manifest.permissions = await getPermissions()
    manifest.manifestVersion = await getManifestVersion()

    console.log("About to create manifest")
    console.log(manifest)
    const isManifestAccepted = await getConfirmation("Is this OK?", true)

    if (isManifestAccepted) {
      writeManifestFile(manifest)
      console.log("\x1b[42m%s\x1b[0m", "Manifest created successfully!")
      const isRegistrationAccepted = await getConfirmation("Register the tapplet right now?")

      if (isRegistrationAccepted) {
        console.log("\x1b[42m%s\x1b[0m", "Registration process has started!")
        await registerTapp()
      } else {
        console.log("To register the tapplet use 'tapp-registrant register'")
      }
    } else {
      console.log("Manifest file creation failed. Start the process over or create the manifest manually")
    }
  } catch (err) {
    console.log(err)
    console.log("\x1b[41m%s\x1b[0m", "Manifest file creation failed")
  }
}
