import * as fs from "fs"
import * as path from "path"
import { NpmPackageJson } from "../types/tapplet.js"
import { MANIFEST_FILE } from "../constants.js"
import { TappletManifest } from "../types/registry.js"

export function getTappManifest(): TappletManifest {
  const manifestPath = path.resolve(MANIFEST_FILE)

  const tappData = fs.readFileSync(manifestPath, "utf8")
  return JSON.parse(tappData)
}

export function writeManifestFile(manifest: TappletManifest): void {
  const json = JSON.stringify(manifest, null, 2)

  fs.writeFileSync(MANIFEST_FILE, json)
}

export function getPackageJson(): NpmPackageJson {
  const packagePath = path.resolve("package.json")

  try {
    const packageData = fs.readFileSync(packagePath, "utf8")
    return JSON.parse(packageData)
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("You must be in your tapplet root directory to read package.json file")
    }
    throw error
  }
}

export function removeManifestFile(): void {
  const manifestPath = path.resolve(".", MANIFEST_FILE)
  fs.rmSync(manifestPath)
}
