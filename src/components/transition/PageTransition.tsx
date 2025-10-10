"use client";

import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import "./transition.css";

const PageTransition = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const blocksRef = useRef<HTMLDivElement[]>([]);
    const isTransitioning = useRef<boolean>(false);

    useEffect(() => {
        const createBlocks = () => {
            if (!overlayRef.current) return;
            overlayRef.current.innerHTML = "";
            blocksRef.current = [];

            for (let i = 0; i < 20; i++) {
                const block = document.createElement("div");
                block.className = "block";
                overlayRef.current.appendChild(block);
                blocksRef.current.push(block);
            }
        };

        createBlocks();

        gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

        revealPage();

        const handleRouteChange = (url: string) => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;
            coverPage(url);
        };

        const handleClick = (e: MouseEvent) => {
            e.preventDefault();
            const target = e.currentTarget;
            if (!(target instanceof HTMLAnchorElement)) return;
            const url = new URL(target.href).pathname;
            if (url !== pathname) handleRouteChange(url);
        };

        const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');
        links.forEach(link => link.addEventListener("click", handleClick));

        return () => {
            links.forEach(link => {
                link.removeEventListener("click", handleClick);
            });
        };
    }, [router, pathname]);

    const coverPage = (url: string) => {
        const tl = gsap.timeline({
            onComplete: () => router.push(url),
        });

        tl.to(blocksRef.current, {
            scaleX: 1,
            duration: 0.6,
            stagger: 0.02,
            ease: "power2.out",
            transformOrigin: "left",
        });
    };

    const revealPage = () => {
        gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });

        gsap.to(blocksRef.current, {
            scaleX: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: "power2.out",
            transformOrigin: "right",
            onComplete: () => {
                isTransitioning.current = false;
            },
        });
    };

    return (
        <div>
            <div ref={overlayRef} className="transition-overlay"></div>
            {children}
        </div>
    );
};

export default PageTransition;
