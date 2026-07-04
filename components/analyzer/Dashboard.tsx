"use client";

import { Overview } from "./Overview";
import { motion } from "framer-motion";
import { Statistics } from "./Statistics";
import { ScriptsList } from "./ScriptsList";
import { ExportButton } from "./ExportButton";
import { PackageAnalysis } from "@/types/package";
import { DependencyList } from "./DependencyList";

interface DashboardProps {
  data: PackageAnalysis;
}

export function Dashboard({ data }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-6"
    >
      {/* Export Button - Top Right */}
      <div className="flex justify-end">
        <ExportButton data={data} />
      </div>

      {/* Overview & Statistics Side by Side on Desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Overview data={data} />
        <Statistics data={data} />
      </div>

      {/* Dependencies */}
      <DependencyList
        dependencies={data.dependencies}
        devDependencies={data.devDependencies}
        title="Dependencies"
      />

      {/* Peer & Optional Dependencies if exist */}
      {(data.peerDependencies.length > 0 ||
        data.optionalDependencies.length > 0) && (
        <DependencyList
          dependencies={data.peerDependencies}
          devDependencies={data.optionalDependencies}
          title="Additional Dependencies"
        />
      )}

      {/* Scripts */}
      {data.scripts.length > 0 && <ScriptsList scripts={data.scripts} />}
    </motion.div>
  );
}
