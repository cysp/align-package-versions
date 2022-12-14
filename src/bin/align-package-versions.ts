#!/usr/bin/env node

import { argv } from "node:process";
import {
  alignPackageVersions,
  loadConfiguration,
  loadWorkspacePackageJsons,
} from "../lib";

async function main() {
  const config = await loadConfiguration();

  const packageJsons = await loadWorkspacePackageJsons(".", ".");

  const patterns = config?.patterns ?? argv.slice(2).map((s) => new RegExp(s));
  for (const pattern of patterns) {
    console.log(pattern);
    const [modified, version] = alignPackageVersions(packageJsons, pattern);
    if (modified) {
      console.log("  ", version);
    } else {
      console.log("  ~");
    }
  }

  await Promise.all(packageJsons.map((packageJson) => packageJson.save()));
}

void main();
