"use client";

import ContextMenu from "@/components/menu/ContextMenu";
import Navbar from "@/components/navbar";
import PageTransition from "@/components/transition/PageTransition";
import ThemeTransition from "@/components/transition/ThemeTransition";
import gsap from "gsap";
import ReactLenis, { type LenisRef } from "lenis/react";
import { ThemeProvider } from "next-themes";
import { useEffect, useRef } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<LenisRef | null>(null);

    useEffect(() => {
        const update = (time: number) => {
            if (lenisRef.current?.lenis) {
                lenisRef.current.lenis.raf(time * 1000);
            }
        };

        gsap.ticker.add(update);
        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="light">
            <ThemeTransition />
            <PageTransition>
                <Navbar logo="Maynkudu" />
                <ContextMenu />
                <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
                <div className="bg-background ">{children}</div>
            </PageTransition>
        </ThemeProvider>
    );
}
