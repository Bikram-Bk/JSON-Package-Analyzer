"use client";

import { motion } from "framer-motion";
import { FileJson, Upload, Shield, Zap } from "lucide-react";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 mb-8"
        >
          <FileJson className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-3"
        >
          Ready to Analyze
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-center max-w-md mb-8"
        >
          Upload your package.json file above to get started. Everything is
          processed securely in your browser.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full"
        >
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs font-medium">100% Private</p>
            <p className="text-[10px] text-muted-foreground text-center">
              No data leaves your browser
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs font-medium">Instant Results</p>
            <p className="text-[10px] text-muted-foreground text-center">
              Analysis in milliseconds
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
              <Upload className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-xs font-medium">Easy Upload</p>
            <p className="text-[10px] text-muted-foreground text-center">
              Drag & drop or click
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
