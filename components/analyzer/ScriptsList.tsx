"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { Card } from "@/components/ui/card";
import { useCopy } from "@/hooks/useCopy";
import { ScriptInfo } from "@/types/package";
import { Button } from "@/components/ui/button";
import { Terminal, Copy, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScriptsListProps {
  scripts: ScriptInfo[];
}

export function ScriptsList({ scripts }: ScriptsListProps) {
  const [search, setSearch] = useState("");
  const { copy } = useCopy();

  const normalizeText = (value: unknown) => {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return "";
  };

  const filtered = scripts.filter((script) => {
    const haystack =
      `${normalizeText(script.name)} ${normalizeText(script.command)}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const commonScripts = [
    "start",
    "build",
    "test",
    "dev",
    "lint",
    "format",
    "deploy",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Scripts
          </h3>
          <span className="text-sm text-muted-foreground">
            {scripts.length} script{scripts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search scripts..."
          />
        </div>

        {/* Scripts List */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-2 max-h-96 overflow-y-auto"
            >
              {filtered.map((script, index) => {
                const displayName =
                  normalizeText(script.name) || "Unnamed script";
                const displayCommand =
                  normalizeText(script.command) || "No command provided";
                const isCommon = commonScripts.includes(displayName);
                return (
                  <motion.div
                    key={`${displayName}-${index}`}
                    variants={item}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group ${
                      isCommon ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`p-1.5 rounded ${
                          isCommon ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        <Terminal
                          className={`h-4 w-4 ${
                            isCommon ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{displayName}</p>
                          {isCommon && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                              common
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {displayCommand}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() =>
                        copy(displayCommand, `Script "${displayName}" copied`)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              {search ? "No scripts match your search" : "No scripts found"}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
