import type PackageJson from "@npmcli/package-json";
import { findGreatestPackageVersion } from "./find-package-versions";
import { setPackageVersions } from "./set-package-versions";

export function alignPackageVersions(
  packageJsons: PackageJson[],
  pattern: RegExp
): [false, string | null] | [true, string] {
  const version = findGreatestPackageVersion(packageJsons, pattern);
  if (!version) {
    return [false, null];
  }

  let modified = false;

  for (const packageJson of packageJsons) {
    modified ||= setPackageVersions(packageJson, pattern, version);
  }

  return [modified, version];
}
