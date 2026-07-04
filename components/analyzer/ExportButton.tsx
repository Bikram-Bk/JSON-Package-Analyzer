"use client";

import { useState } from "react";
import { useCopy } from "@/hooks/useCopy";
import { PackageAnalysis } from "@/types/package";
import { Download, Copy, FileJson, List, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportAnalysis,
  copyDependencyList,
  copyScripts,
} from "@/lib/exporter";

interface ExportButtonProps {
  data: PackageAnalysis;
}

export function ExportButton({ data }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const { copy } = useCopy();

  const handleCopyDependencies = () => {
    const text = copyDependencyList(data);
    copy(text, "Dependencies copied to clipboard");
    setOpen(false);
  };

  const handleCopyScripts = () => {
    const text = copyScripts(data);
    copy(text, "Scripts copied to clipboard");
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95"
        type="button"
      >
        <Download className="mr-2 h-4 w-4" />
        Export
        <ChevronDown className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold">Export Options</div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              exportAnalysis(data, "json");
              setOpen(false);
            }}
          >
            <FileJson className="mr-2 h-4 w-4" />
            Export Full Analysis (JSON)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              exportAnalysis(data, "summary");
              setOpen(false);
            }}
          >
            <FileJson className="mr-2 h-4 w-4" />
            Export Summary (JSON)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              exportAnalysis(data, "dependencies");
              setOpen(false);
            }}
          >
            <List className="mr-2 h-4 w-4" />
            Export Dependencies Only
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCopyDependencies}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Dependencies List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyScripts}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Scripts
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
