"use client";

import { motion } from "framer-motion";
import { useCopy } from "@/hooks/useCopy";
import { Card } from "@/components/ui/card";
import { PackageAnalysis } from "@/types/package";
import {
  Package,
  User,
  Scale,
  Globe,
  GitBranch,
  Shield,
  Tag,
  Cog,
} from "lucide-react";

interface OverviewProps {
  data: PackageAnalysis;
}

export function Overview({ data }: OverviewProps) {
  const { projectInfo } = data;
  const { copy } = useCopy();

  const infoItems = [
    { label: "Name", value: projectInfo.name, icon: Package },
    { label: "Version", value: `v${projectInfo.version}`, icon: Tag },
    { label: "Author", value: projectInfo.author, icon: User },
    { label: "License", value: projectInfo.license, icon: Scale },
    { label: "Homepage", value: projectInfo.homepage, icon: Globe },
    { label: "Repository", value: projectInfo.repository, icon: GitBranch },
    {
      label: "Private",
      value: projectInfo.isPrivate ? "Yes" : "No",
      icon: Shield,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Project Overview
          </h3>
        </div>

        {/* Description */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {projectInfo.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                onClick={() => copy(item.value, `${item.label} copied`)}
              >
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium truncate">{item.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Keywords */}
        {projectInfo.keywords.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Keywords</p>
            <div className="flex flex-wrap gap-2">
              {projectInfo.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Engines */}
        {projectInfo.engines && Object.keys(projectInfo.engines).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Cog className="h-3 w-3" />
              Engines
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(projectInfo.engines).map(([engine, version]) => (
                <span
                  key={engine}
                  className="px-2 py-1 text-xs rounded-full bg-muted"
                >
                  {engine}: {version}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
