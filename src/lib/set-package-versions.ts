import PackageJson from "@npmcli/package-json";

export function setPackageVersions(
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
