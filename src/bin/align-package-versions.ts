import PackageJson from "@npmcli/package-json";
import { argv } from "node:process";
import semver from "semver";
import { loadWorkspacePackageJsons } from "../lib/package-json";

function alignPackageVersions(packageJsons: PackageJson[], pattern: RegExp) {
  const version = findPackageVersion(packageJsons, pattern);
  if (version) {
    for (const packageJson of packageJsons) {
      setPackageVersions(packageJson, pattern, version);
    }
  }
}

function findPackageVersion(
  packageJsons: PackageJson[],
  pattern: RegExp
): string | undefined {
  const versions = packageJsons.flatMap(
    (packageJson) => findPackageVersions_(packageJson, pattern) ?? []
  );
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

function findPackageVersions_(
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

function setPackageVersions(
  packageJson: PackageJson,
  pattern: RegExp,
  version: string
) {
  for (const type of ["devDependencies", "dependencies"] as const) {
    const dependency = packageJson.content[type];
    if (!dependency) {
      continue;
    }

    for (const [packageName] of Object.entries(dependency)) {
      if (pattern.test(packageName)) {
        dependency[packageName] = version;
      }
    }
    packageJson.update({
      [type]: dependency,
    });
  }
}

async function main() {
  const packageJsons = await loadWorkspacePackageJsons(".", ".");

  for (const pattern of argv.slice(2)) {
    alignPackageVersions(packageJsons, new RegExp(pattern));
  }

  await Promise.all(packageJsons.map((packageJson) => packageJson.save()));
}

void main();
