import {
  PackageJson,
  PackageAnalysis,
  DependencyInfo,
  ScriptInfo,
} from "@/types/package";
import { formatAuthor } from "@/utils/formatPackage";

function normalizeStringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function getDependencyEntries(
  source: unknown,
  type: DependencyInfo["type"],
): DependencyInfo[] {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return [];
  }

  return Object.entries(source as Record<string, unknown>)
    .filter(([name]) => typeof name === "string" && name.trim().length > 0)
    .map(([name, version]) => ({
      name,
      version: normalizeStringValue(version, "unknown"),
      type,
    }));
}

function getScriptEntries(source: unknown): ScriptInfo[] {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return [];
  }

  return Object.entries(source as Record<string, unknown>)
    .filter(([name]) => typeof name === "string" && name.trim().length > 0)
    .map(([name, command]) => ({
      name,
      command: normalizeStringValue(command, "No command provided"),
    }));
}

function normalizeStringRecord(source: unknown): Record<string, string> | null {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return null;
  }

  const entries = Object.entries(source as Record<string, unknown>)
    .filter(([, value]) => typeof value === "string")
    .map(([key, value]) => [key, value as string]);

  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

export function analyzePackage(packageJson: PackageJson): PackageAnalysis {
  const dependencies: DependencyInfo[] = [];
  const devDependencies: DependencyInfo[] = [];
  const peerDependencies: DependencyInfo[] = [];
  const optionalDependencies: DependencyInfo[] = [];
  const scripts: ScriptInfo[] = [];

  dependencies.push(
    ...getDependencyEntries(packageJson.dependencies, "dependency"),
  );
  devDependencies.push(
    ...getDependencyEntries(packageJson.devDependencies, "devDependency"),
  );
  peerDependencies.push(
    ...getDependencyEntries(packageJson.peerDependencies, "dependency"),
  );
  optionalDependencies.push(
    ...getDependencyEntries(packageJson.optionalDependencies, "dependency"),
  );
  scripts.push(...getScriptEntries(packageJson.scripts));

  // Sort alphabetically
  const sortByName = (a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name);
  dependencies.sort(sortByName);
  devDependencies.sort(sortByName);
  peerDependencies.sort(sortByName);
  optionalDependencies.sort(sortByName);
  scripts.sort(sortByName);

  // Get common scripts
  const commonScripts = [
    "start",
    "build",
    "test",
    "dev",
    "lint",
    "format",
    "clean",
    "deploy",
  ];
  const availableCommonScripts = scripts.filter((s) =>
    commonScripts.includes(s.name),
  );

  // Analyze version patterns
  const versionPatterns = analyzeVersionPatterns([
    ...dependencies,
    ...devDependencies,
  ]);

  // Project info
  const projectInfo = {
    name: packageJson.name || "Unnamed Project",
    version: packageJson.version || "0.0.0",
    description: packageJson.description || "No description provided",
    author: formatAuthor(packageJson.author),
    license: packageJson.license || "Not specified",
    homepage: normalizeStringValue(packageJson.homepage, "Not specified"),
    repository:
      typeof packageJson.repository === "string"
        ? packageJson.repository
        : packageJson.repository?.url || "Not specified",
    isPrivate: Boolean(packageJson.private),
    engines: normalizeStringRecord(packageJson.engines),
    keywords: Array.isArray(packageJson.keywords)
      ? packageJson.keywords.filter(
        (keyword): keyword is string => typeof keyword === "string",
      )
      : [],
  };

  // Statistics
  const statistics = {
    totalDependencies: dependencies.length,
    totalDevDependencies: devDependencies.length,
    totalPeerDependencies: peerDependencies.length,
    totalOptionalDependencies: optionalDependencies.length,
    totalAllDependencies:
      dependencies.length +
      devDependencies.length +
      peerDependencies.length +
      optionalDependencies.length,
    totalScripts: scripts.length,
    hasDependencies: dependencies.length > 0,
    hasDevDependencies: devDependencies.length > 0,
    hasPeerDependencies: peerDependencies.length > 0,
    hasOptionalDependencies: optionalDependencies.length > 0,
    hasScripts: scripts.length > 0,
    hasKeywords: (packageJson.keywords || []).length > 0,
    versionPatterns,
    commonScripts: availableCommonScripts,
  };

  return {
    projectInfo,
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
    scripts,
    statistics,
    raw: packageJson,
  };
}

interface VersionPatterns {
  exact: number;
  caret: number;
  tilde: number;
  range: number;
  latest: number;
  other: number;
}

function analyzeVersionPatterns(
  dependencies: DependencyInfo[],
): VersionPatterns {
  const patterns: VersionPatterns = {
    exact: 0,
    caret: 0,
    tilde: 0,
    range: 0,
    latest: 0,
    other: 0,
  };

  dependencies.forEach((dep) => {
    const version = dep.version;
    if (version === "latest" || version === "*") {
      patterns.latest++;
    } else if (version.startsWith("^")) {
      patterns.caret++;
    } else if (version.startsWith("~")) {
      patterns.tilde++;
    } else if (
      version.includes(">=") ||
      version.includes("<=") ||
      version.includes(">") ||
      version.includes("<")
    ) {
      patterns.range++;
    } else if (/^\d/.test(version)) {
      patterns.exact++;
    } else {
      patterns.other++;
    }
  });

  return patterns;
}

export function getDependencyStats(dependencies: DependencyInfo[]) {
  return {
    total: dependencies.length,
    withVersion: dependencies.filter((d) => d.version !== "*").length,
    latest: dependencies.filter(
      (d) => d.version === "latest" || d.version === "*",
    ).length,
    scoped: dependencies.filter((d) => d.name.startsWith("@")).length,
    types: dependencies.filter((d) => d.name.startsWith("@types/")).length,
  };
}
