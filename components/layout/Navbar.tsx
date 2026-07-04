"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Button
            key={link.href}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            asChild
            className="relative"
          >
            <Link href={link.href}>
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
