"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { useCopy } from "@/hooks/useCopy";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DependencyInfo } from "@/types/package";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Copy, ExternalLink, Box } from "lucide-react";

interface DependencyListProps {
  dependencies: DependencyInfo[];
  devDependencies: DependencyInfo[];
  title?: string;
}

export function DependencyList({
  dependencies,
  devDependencies,
  title = "Dependencies",
}: DependencyListProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dependencies" | "devDependencies"
  >("dependencies");
  const { copy } = useCopy();

  const currentList =
    activeTab === "dependencies" ? dependencies : devDependencies;

  const normalizeText = (value: unknown) => {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return "";
  };

  const filtered = currentList.filter((dep) => {
    const haystack =
      `${normalizeText(dep.name)} ${normalizeText(dep.version)}`.toLowerCase();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            {title}
          </h3>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === "dependencies" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("dependencies")}
            >
              Dependencies ({dependencies.length})
            </Button>
            <Button
              variant={activeTab === "devDependencies" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("devDependencies")}
            >
              Dev Deps ({devDependencies.length})
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={`Search ${activeTab === "dependencies" ? "dependencies" : "dev dependencies"}...`}
          />
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {search
            ? `Showing ${filtered.length} of ${currentList.length} packages`
            : `${currentList.length} package${currentList.length !== 1 ? "s" : ""}`}
        </p>

        {/* Dependency List */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar"
            >
              {filtered.map((dep, index) => {
                const displayName = normalizeText(dep.name) || "Unknown";
                const displayVersion = normalizeText(dep.version) || "unknown";

                return (
                  <motion.div
                    key={`${displayName}-${index}`}
                    variants={item}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {displayVersion}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          copy(`${displayName}@${displayVersion}`, "Copied")
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          window.open(
                            `https://www.npmjs.com/package/${displayName}`,
                            "_blank",
                          )
                        }
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
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
              {search ? "No packages match your search" : "No packages found"}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
