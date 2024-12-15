"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefreshButton({ isLoading, handler }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handler}
      disabled={isLoading}
      aria-label="Refresh"
    >
      <motion.div
        animate={{ rotate: isLoading ? 360 : 0 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: isLoading ? Infinity : 0,
        }}
      >
        <RefreshCw className="h-4 w-4" />
      </motion.div>
    </Button>
  );
}
