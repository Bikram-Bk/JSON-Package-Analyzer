"use client";

import { toast } from "sonner";
import { useState, useCallback } from "react";
import { copyToClipboard } from "@/utils/copyToClipboard";

export function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string, label: string = "Copied to clipboard") => {
      const success = await copyToClipboard(text);

      if (success) {
        setCopied(true);
        toast.success(label);
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error("Failed to copy");
      }
    },
    [],
  );

  return { copied, copy };
}
