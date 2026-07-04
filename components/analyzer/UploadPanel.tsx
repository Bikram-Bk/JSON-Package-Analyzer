"use client";

import { DropZone } from "./DropZone";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/utils/formatPackage";
import { motion, AnimatePresence } from "framer-motion";
import { FileJson, Trash2, Play, Shield, Zap } from "lucide-react";

interface UploadPanelProps {
  file: File | null;
  fileName: string;
  isDragging: boolean;
  error: string | null;
  isAnalyzing: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onAnalyze: () => void;
}

export function UploadPanel({
  file,
  fileName,
  isDragging,
  error,
  isAnalyzing,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onClear,
  onAnalyze,
}: UploadPanelProps) {
  const isValid = file !== null && !error;
  const fileSize = file ? formatBytes(file.size) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="bg-card border rounded-xl p-5 shadow-sm ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <FileJson className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Upload package.json</h2>
              <p className="text-sm text-muted-foreground">
                Your file is processed entirely in your browser
              </p>
            </div>
          </div>

          {/* Privacy Badges */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-xs text-green-600 dark:text-green-400">
              <Shield className="h-3 w-3" />
              <span>Private</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-xs text-primary">
              <Zap className="h-3 w-3" />
              <span>Instant</span>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <DropZone
          isDragging={isDragging}
          fileName={fileName || null}
          fileSize={fileSize}
          error={error}
          isValid={isValid}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onFileSelect={onFileSelect}
        />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 text-sm text-destructive bg-destructive/10 rounded-lg p-3 border border-destructive/20">
                <div className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">⚠</span>
                  <div>
                    <p className="font-medium">Upload Error</p>
                    <p className="text-destructive/80">{error}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <AnimatePresence>
          {file && !error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row gap-3 mt-6"
            >
              <Button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="flex-1"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2"
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Analyze package.json
                  </>
                )}
              </Button>
              <Button
                onClick={onClear}
                variant="outline"
                disabled={isAnalyzing}
                size="lg"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
