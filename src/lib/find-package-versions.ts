import PackageJson from "@npmcli/package-json";
import semver from "semver";

export function findGreatestPackageVersion(
  packageJsons: PackageJson[],
  pattern: RegExp
): string | undefined {
  const versions = findPackageVersions(packageJsons, pattern);
  const [v, ...vv] = versions;
  if (!v) {
    return undefined;
  }
  return vv.reduce((acc, cur) => {
    if (semver.gt(cur, acc)) {
      return cur;
    }
    return acc;
  }, v);
}

export function findPackageVersions(
  packageJsons: PackageJson[],
  pattern: RegExp
): string[] {
  return packageJsons.flatMap(
    (packageJson) => findPackageVersion(packageJson, pattern) ?? []
  );
}

export function findPackageVersion(
  packageJson: PackageJson,
  pattern: RegExp
): string[] {
  const versions: string[] = [];
  for (const type of ["devDependencies", "dependencies"] as const) {
    const v = packageJson.content[type];
    if (!v) {
      continue;
    }

    for (const [packageName, version] of Object.entries(v)) {
      if (pattern.test(packageName)) {
        versions.push(version);
      }
    }
  }
  return versions;
}
