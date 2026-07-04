"use client";

import { useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/landing/Footer";
import { useFileUpload } from "@/hooks/useFileUpload";
import { motion, AnimatePresence } from "framer-motion";
import { Dashboard } from "@/components/analyzer/Dashboard";
import { EmptyState } from "@/components/analyzer/EmptyState";
import { ErrorState } from "@/components/analyzer/ErrorState";
import { usePackageAnalyzer } from "@/hooks/usePackageAnalyzer";
import { ScrollToTop } from "@/components/analyzer/ScrollToTop";
import { UploadPanel } from "@/components/analyzer/UploadPanel";
import { LoadingState } from "@/components/analyzer/LoadingState";

export default function AnalyzerPage() {
  const {
    file,
    fileName,
    isDragging,
    error: uploadError,
    warning,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    clearFile,
    readFile,
  } = useFileUpload();

  const {
    status,
    data,
    error: analysisError,
    analyze,
    reset,
  } = usePackageAnalyzer();

  const handleAnalyze = useCallback(async () => {
    try {
      const content = await readFile();
      analyze(content);
      // Scroll to results after analysis
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }, 800);
    } catch (err) {
      console.error("Failed to read file:", err);
    }
  }, [readFile, analyze]);

  const handleClear = useCallback(() => {
    clearFile();
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [clearFile, reset]);

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <UploadPanel
              file={file}
              fileName={fileName}
              isDragging={isDragging}
              error={uploadError}
              isAnalyzing={status === "loading"}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              onClear={handleClear}
              onAnalyze={handleAnalyze}
            />
          </motion.div>

          {/* Warning Message */}
          <AnimatePresence>
            {warning && !uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
              >
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {warning}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {status === "idle" && !file && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState />
              </motion.div>
            )}
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState />
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorState
                  message={analysisError || "An error occurred during analysis"}
                  onRetry={handleAnalyze}
                />
              </motion.div>
            )}
            {status === "success" && data && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Dashboard data={data} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <ScrollToTop />
      <Footer />
    </>
  );
}
