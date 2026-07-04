"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface DropZoneProps {
  isDragging: boolean;
  fileName: string | null;
  fileSize?: string | null;
  error: string | null;
  isValid: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DropZone({
  isDragging,
  fileName,
  fileSize,
  error,
  isValid,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: DropZoneProps) {
  return (
    <motion.div
      whileHover={{ scale: fileName ? 1.005 : 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer
        transition-all duration-300
        ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : error
              ? "border-destructive/50 bg-destructive/5"
              : fileName && isValid
                ? "border-green-500/50 bg-green-500/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 focus-within:border-primary/50 focus-within:bg-muted/50"
        }
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          document.getElementById("file-upload")?.click();
        }
      }}
      aria-label={
        fileName && isValid
          ? `File ${fileName} selected. Click or drop to replace.`
          : error
            ? "Invalid file. Click or drop to try again."
            : "Upload package.json file. Click or drag and drop."
      }
      aria-describedby="dropzone-hint"
    >
      <input
        id="file-upload"
        type="file"
        accept=".json"
        onChange={onFileSelect}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
      <span id="dropzone-hint" className="sr-only">
        Only .json files up to 5MB are accepted
      </span>

      <AnimatePresence mode="wait">
        {fileName && isValid ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10"
            >
              <CheckCircle2
                className="h-8 w-8 text-green-500"
                aria-hidden="true"
              />
            </motion.div>
            <div>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {fileName}
              </p>
              {fileSize && (
                <p className="text-sm text-muted-foreground">{fileSize}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Click or drop to replace
              </p>
            </div>
          </motion.div>
        ) : fileName && error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10">
              <AlertCircle
                className="h-8 w-8 text-destructive"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-destructive">
                Invalid File
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Click or drop to try again
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2"
            >
              <Upload className="h-8 w-8 text-primary" aria-hidden="true" />
            </motion.div>
            <div>
              <p className="text-lg font-semibold">
                {isDragging
                  ? "Drop your file here"
                  : "Drag & drop your package.json here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse files
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Only .json files up to 5MB are accepted
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
