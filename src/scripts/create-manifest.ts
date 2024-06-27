import * as fs from "fs";
import { MANIFEST_FILE } from "../constants";
import { Manifest } from "../types/manifest";

export function createManifest(manifest: Manifest) {
  const json = JSON.stringify(manifest, null, 2);

  fs.writeFileSync(MANIFEST_FILE, json);
}
