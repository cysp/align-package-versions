import PackageJson from "@npmcli/package-json";
import { findGreatestPackageVersion } from "./find-package-versions";
import { setPackageVersions } from "./set-package-versions";

export function alignPackageVersions(
  packageJsons: PackageJson[],
  pattern: RegExp
): boolean {
  const version = findGreatestPackageVersion(packageJsons, pattern);
  if (!version) {
    return false;
  }

  for (const packageJson of packageJsons) {
    setPackageVersions(packageJson, pattern, version);
  }

  return true;
}
