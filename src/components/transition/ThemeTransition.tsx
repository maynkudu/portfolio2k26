"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeTransition() {
    const { resolvedTheme } = useTheme();
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (!resolvedTheme) return;
        setIsTransitioning(true);
        const timer = setTimeout(() => setIsTransitioning(false), 200);
        return () => clearTimeout(timer);
    }, [resolvedTheme]);

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    key="theme-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] pointer-events-none
                     bg-gradient-to-br from-white to-neutral-300
                     dark:from-[#090909] dark:to-[#1a1a1a]
                     backdrop-blur-[8px]"
                />
            )}
        </AnimatePresence>
    );
}
