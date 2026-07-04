"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { PackageAnalysis } from "@/types/package";
import { BarChart3, TrendingUp, Package, Code2, GitBranch } from "lucide-react";

interface StatisticsProps {
  data: PackageAnalysis;
}

export function Statistics({ data }: StatisticsProps) {
  const { statistics } = data;

  const statCards = [
    {
      label: "Dependencies",
      value: statistics.totalDependencies,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Dev Dependencies",
      value: statistics.totalDevDependencies,
      icon: Code2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Peer Dependencies",
      value: statistics.totalPeerDependencies,
      icon: GitBranch,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Total Scripts",
      value: statistics.totalScripts,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-primary" />
          Statistics
        </h3>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg} mb-2`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Version Patterns */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Version Patterns</h4>
          <div className="space-y-2">
            {statistics.versionPatterns.exact > 0 && (
              <VersionBar
                label="Exact"
                count={statistics.versionPatterns.exact}
                total={statistics.totalAllDependencies}
                color="bg-blue-500"
              />
            )}
            {statistics.versionPatterns.caret > 0 && (
              <VersionBar
                label="Caret (^)"
                count={statistics.versionPatterns.caret}
                total={statistics.totalAllDependencies}
                color="bg-green-500"
              />
            )}
            {statistics.versionPatterns.tilde > 0 && (
              <VersionBar
                label="Tilde (~)"
                count={statistics.versionPatterns.tilde}
                total={statistics.totalAllDependencies}
                color="bg-yellow-500"
              />
            )}
            {statistics.versionPatterns.range > 0 && (
              <VersionBar
                label="Range"
                count={statistics.versionPatterns.range}
                total={statistics.totalAllDependencies}
                color="bg-orange-500"
              />
            )}
            {statistics.versionPatterns.latest > 0 && (
              <VersionBar
                label="Latest/*"
                count={statistics.versionPatterns.latest}
                total={statistics.totalAllDependencies}
                color="bg-red-500"
              />
            )}
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total All Dependencies
            </span>
            <span className="text-lg font-bold">
              {statistics.totalAllDependencies}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function VersionBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-20">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs text-muted-foreground w-12 text-right">
        {count}
      </span>
    </div>
  );
}
