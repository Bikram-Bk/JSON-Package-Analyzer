export interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  module?: string;
  types?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  keywords?: string[];
  author?: string | { name: string; email?: string; url?: string };
  license?: string;
  repository?:
  | {
    type: string;
    url: string;
  }
  | string;
  homepage?: string;
  bugs?: {
    url: string;
    email?: string;
  };
  engines?: Record<string, string>;
  private?: boolean;
  type?: string;
  exports?: Record<string, unknown> | string;
  files?: string[];
  [key: string]: unknown;
}

export interface PackageAnalysis {
  projectInfo: {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    homepage: string;
    repository: string;
    isPrivate: boolean;
    engines: Record<string, string> | null;
    keywords: string[];
  };
  dependencies: DependencyInfo[];
  devDependencies: DependencyInfo[];
  peerDependencies: DependencyInfo[];
  optionalDependencies: DependencyInfo[];
  scripts: ScriptInfo[];
  statistics: {
    totalDependencies: number;
    totalDevDependencies: number;
    totalPeerDependencies: number;
    totalOptionalDependencies: number;
    totalAllDependencies: number;
    totalScripts: number;
    hasDependencies: boolean;
    hasDevDependencies: boolean;
    hasPeerDependencies: boolean;
    hasOptionalDependencies: boolean;
    hasScripts: boolean;
    hasKeywords: boolean;
    versionPatterns: {
      exact: number;
      caret: number;
      tilde: number;
      range: number;
      latest: number;
      other: number;
    };
    commonScripts: ScriptInfo[];
  };
  raw: PackageJson;
}

export interface DependencyInfo {
  name: string;
  version: string;
  type: "dependency" | "devDependency";
}

export interface ScriptInfo {
  name: string;
  command: string;
}

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export interface AnalysisState {
  status: AnalysisStatus;
  data: PackageAnalysis | null;
  error: string | null;
}
