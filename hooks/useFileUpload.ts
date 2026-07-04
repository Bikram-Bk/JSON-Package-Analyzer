"use client";

import { useState, useCallback } from "react";
import { readFileAsText } from "@/lib/parser";
import { validateFile } from "@/utils/validatePackage";

interface UseFileUploadReturn {
  file: File | null;
  fileName: string;
  isDragging: boolean;
  error: string | null;
  warning: string | null;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
  readFile: () => Promise<string>;
}

export function useFileUpload(): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const validateAndSetFile = useCallback((selectedFile: File) => {
    const validation = validateFile(selectedFile);

    if (!validation.isValid) {
      setError(validation.errors[0]);
      setWarning(null);
      setFile(null);
      setFileName(selectedFile.name);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setFileName(selectedFile.name);

    // Set warning if any
    if (validation.warnings.length > 0) {
      setWarning(validation.warnings[0]);
    } else {
      setWarning(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        validateAndSetFile(droppedFile);
      }
    },
    [validateAndSetFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        validateAndSetFile(selectedFile);
      }
      // Reset input so the same file can be selected again
      e.target.value = "";
    },
    [validateAndSetFile],
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setFileName("");
    setError(null);
    setWarning(null);
  }, []);

  const readFile = useCallback(async (): Promise<string> => {
    if (!file) {
      throw new Error("No file selected");
    }
    return readFileAsText(file);
  }, [file]);

  return {
    file,
    fileName,
    isDragging,
    error,
    warning,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    clearFile,
    readFile,
  };
}
