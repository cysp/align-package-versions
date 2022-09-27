import path from "node:path";
import PackageJson from "@npmcli/package-json";
import globby from "globby";

export async function loadWorkspacePackageJsons(
  cwd: string,
  packageJsonPath: string
): Promise<PackageJson[]> {
  const base = await PackageJson.load(packageJsonPath);

  const workspacePatterns = workspacePatternsFromPackageJson(base) ?? [];

  const workspacePaths = await globby(workspacePatterns, {
    cwd: path.join(cwd, packageJsonPath),
    onlyDirectories: true,
    expandDirectories: false,
  });

  const workspaces = (
    await Promise.all(
      workspacePaths.flatMap((workspacePath) =>
        loadWorkspacePackageJsons(
          path.join(cwd, packageJsonPath),
          workspacePath
        )
      )
    )
  ).flat();

  return [base, ...workspaces];
}

export function workspacePatternsFromPackageJson(
  packageJson: PackageJson
): string[] | undefined {
  if (Array.isArray(packageJson.content.workspaces)) {
    return packageJson.content.workspaces;
  }

  return packageJson.content.workspaces?.packages;
}
