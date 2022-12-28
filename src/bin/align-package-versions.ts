#!/usr/bin/env node

import { argv } from "node:process";
import { alignPackageVersions } from "../lib/align-package-versions";
import { loadWorkspacePackageJsons } from "../lib/package-json";

async function main() {
  const packageJsons = await loadWorkspacePackageJsons(".", ".");

  for (const pattern of argv.slice(2)) {
    alignPackageVersions(packageJsons, new RegExp(pattern));
  }

  await Promise.all(packageJsons.map((packageJson) => packageJson.save()));
}

void main();
