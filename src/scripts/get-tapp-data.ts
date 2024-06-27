import * as fs from "fs";
import * as path from "path";
import { TappManifest } from "../types/tapplet";
import { MANIFEST_FILE } from "../constants";

export function getTappManifest(): TappManifest {
  const manifestPath = path.resolve(MANIFEST_FILE);

  const tappData = fs.readFileSync(manifestPath, "utf8");
  return JSON.parse(tappData);
}
