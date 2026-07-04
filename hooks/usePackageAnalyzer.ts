"use client";

import { useState, useCallback } from "react";
import { analyzePackage } from "@/lib/analyzer";
import { parsePackageJson } from "@/lib/parser";
import { validatePackageJson } from "@/utils/validatePackage";
import { PackageAnalysis, AnalysisStatus } from "@/types/package";

interface UsePackageAnalyzerReturn {
  status: AnalysisStatus;
  data: PackageAnalysis | null;
  error: string | null;
  analyze: (fileContent: string) => void;
  reset: () => void;
}

export function usePackageAnalyzer(): UsePackageAnalyzerReturn {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [data, setData] = useState<PackageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback((fileContent: string) => {
    setStatus("loading");
    setError(null);

    try {
      // Parse JSON
      const parsed = parsePackageJson(fileContent);

      // Check if parsing returned null
      if (!parsed) {
        setError(
          "Failed to parse package.json. The file may be empty or invalid.",
        );
        setStatus("error");
        return;
      }

      // Validate
      const validation = validatePackageJson(parsed);

      if (!validation.isValid) {
        setError(validation.errors.join("\n"));
        setStatus("error");
        return;
      }

      // Analyze
      const analysis = analyzePackage(parsed);

      // Small delay for better UX (shows loading state)
      setTimeout(() => {
        setData(analysis);
        setStatus("success");
      }, 600);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, analyze, reset };
}
