import { PackageAnalysis } from "@/types/package";
import { downloadJson } from "@/utils/downloadJson";

export function exportAnalysis(
  analysis: PackageAnalysis,
  format: "json" | "summary" | "dependencies" = "json",
): void {
  const timestamp = new Date().toISOString().split("T")[0];
  const projectName = analysis.projectInfo.name.replace(/[^a-zA-Z0-9-_]/g, "-");

  if (format === "json") {
    downloadJson(analysis, `${projectName}-full-analysis-${timestamp}.json`);
  } else if (format === "summary") {
    const summary = {
      project: analysis.projectInfo,
      summary: {
        totalDependencies: analysis.statistics.totalDependencies,
        totalDevDependencies: analysis.statistics.totalDevDependencies,
        totalPeerDependencies: analysis.statistics.totalPeerDependencies,
        totalOptionalDependencies:
          analysis.statistics.totalOptionalDependencies,
        totalAllDependencies: analysis.statistics.totalAllDependencies,
        totalScripts: analysis.statistics.totalScripts,
      },
      versionPatterns: analysis.statistics.versionPatterns,
      commonScripts: analysis.statistics.commonScripts.reduce(
        (acc, s) => ({ ...acc, [s.name]: s.command }),
        {},
      ),
    };
    downloadJson(summary, `${projectName}-summary-${timestamp}.json`);
  } else if (format === "dependencies") {
    const depList = {
      project: analysis.projectInfo.name,
      version: analysis.projectInfo.version,
      exportDate: timestamp,
      dependencies: analysis.dependencies.map((d) => ({
        name: d.name,
        version: d.version,
      })),
      devDependencies: analysis.devDependencies.map((d) => ({
        name: d.name,
        version: d.version,
      })),
    };
    downloadJson(depList, `${projectName}-dependencies-${timestamp}.json`);
  }
}

export function copyDependencyList(analysis: PackageAnalysis): string {
  const lines: string[] = [];

  if (analysis.dependencies.length > 0) {
    lines.push("# Dependencies");
    analysis.dependencies.forEach((dep) => {
      lines.push(`${dep.name}@${dep.version}`);
    });
    lines.push("");
  }

  if (analysis.devDependencies.length > 0) {
    lines.push("# Dev Dependencies");
    analysis.devDependencies.forEach((dep) => {
      lines.push(`${dep.name}@${dep.version}`);
    });
    lines.push("");
  }

  if (analysis.peerDependencies.length > 0) {
    lines.push("# Peer Dependencies");
    analysis.peerDependencies.forEach((dep) => {
      lines.push(`${dep.name}@${dep.version}`);
    });
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function copyScripts(analysis: PackageAnalysis): string {
  const lines: string[] = [];

  lines.push("# npm Scripts");
  analysis.scripts.forEach((script) => {
    lines.push(`${script.name}: ${script.command}`);
  });

  return lines.join("\n");
}
