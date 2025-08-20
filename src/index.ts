#! /usr/bin/env node
import { Command } from "commander"
import {
  createAndFillInManifest,
  deprecateTappVersion,
  listRegisteredTapplets,
  registerTapp,
  updateTappVersion,
  validateJsonSchema,
} from "./scripts/index.js"
import figlet from "figlet"
import { getGhp } from "./helpers/getGhp.js"
import { init } from "./scripts/init.js"
import { writeEmptyManifest } from "./scripts/writeEmptyManifest.js"
import pkg from "../package.json" with { type: "json" }

console.log(figlet.textSync("TAPPLET REGISTRANT", { font: "Mini" }))

const program = new Command()

program
  .command("init")
  .description("Init the tapplet registration process")
  .action(() => {
    init()
  })
program
  .command("create")
  .description("Create an empty manifest file")
  .action(() => {
    writeEmptyManifest()
  })
program
  .command("fill-in")
  .description("Create and fill in the manifest file")
  .action(() => {
    createAndFillInManifest()
  })
program
  .command("register")
  .description("Register the tapplet")
  .action(() => {
    registerTapp()
  })
program
  .command("update")
  .description("Update tapplet version")
  .action(() => {
    updateTappVersion()
  })
program
  .command("deprecate")
  .description("Deprecate the given tapplet version")
  .argument("<version>", "tapplet version to deprecate")
  .action((version) => {
    deprecateTappVersion(version)
  })
program
  .command("list")
  .description("List registered tapplets")
  .argument("[name]", "(optional) tapplet name to find in the registry")
  .action((name) => {
    listRegisteredTapplets(name)
  })
program
  .command("ghp")
  .description("Find and add GitHub Access Token")
  .action(() => {
    getGhp()
  })
program
  .command("validate-manifest")
  .description("Validate json manifest file if it contains all required fields")
  .action(() => {
    validateJsonSchema()
  })
program.version(pkg.version, "-v, --version", "output the current version")

program.parse()
