"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, FileSearch, BarChart3, Package } from "lucide-react";

const analysisSteps = [
  { icon: FileSearch, text: "Reading package.json..." },
  { icon: Package, text: "Parsing dependencies..." },
  { icon: BarChart3, text: "Generating insights..." },
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % analysisSteps.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Animated Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <div className="relative">
          <Loader2 className="h-16 w-16 text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/10" />
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <h3 className="text-xl font-semibold mb-6">
        Analyzing your package.json
      </h3>

      <div className="space-y-3 w-full max-w-xs">
        {analysisSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <motion.div
              key={step.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10"
                  : isDone
                    ? "opacity-50"
                    : "opacity-30"
              }`}
            >
              <StepIcon
                className={`h-5 w-5 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {step.text}
              </span>
              {isDone && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-2 w-2 rounded-full bg-green-500"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground mt-6">
        Processing entirely in your browser...
      </p>
    </motion.div>
  );
}
