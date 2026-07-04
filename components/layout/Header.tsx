"use client";

import Link from "next/link";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      role="banner"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
          aria-label="Package.json Analyzer - Home"
        >
          <Package className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-xl font-bold hidden sm:inline">
            Package Analyzer
          </span>
          <span className="text-xl font-bold sm:hidden">PA</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Navbar />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
