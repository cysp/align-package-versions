#!/usr/bin/env node

import { argv } from "node:process";
import { alignPackageVersions } from "../lib/align-package-versions";
import { loadConfiguration } from "../lib/cosmiconfig";
import { loadWorkspacePackageJsons } from "../lib/package-json";

async function main() {
  const config = await loadConfiguration();

  const packageJsons = await loadWorkspacePackageJsons(".", ".");

  const patterns = config?.patterns ?? argv.slice(2).map((s) => new RegExp(s));
  for (const pattern of patterns) {
    alignPackageVersions(packageJsons, pattern);
  }

  await Promise.all(packageJsons.map((packageJson) => packageJson.save()));
}

void main();
