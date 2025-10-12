"use client";

import Button from "@/components/common/button";
import useMousePosition from "@/hooks/useMousePosition";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const linesRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLAnchorElement | null>(null);
    const evilRef = useRef<HTMLDivElement | null>(null);
    const cursor = useMousePosition();

    useGSAP(
        () => {
            gsap.fromTo(
                linesRef.current,
                {
                    scale: 5,
                },
                {
                    scale: 1,
                }
            );

            const container = containerRef.current;
            if (!container) return;

            const children = Array.from(container.children).filter(
                el => el !== buttonRef.current && el !== evilRef.current
            );
            const targetY = window.innerHeight * 0.4;

            gsap.to(children, {
                y: targetY,
                rotation: gsap.utils.random(-15, 15),
                duration: gsap.utils.random(1.5, 2.5),
                ease: "bounce.out",
                delay: 7,
                stagger: 0.05,
            });

            // Fade in evil
            gsap.fromTo(
                evilRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 2, ease: "power1.out", delay: 9 }
            );
        },
        {
            scope: containerRef,
        }
    );

    // Repulsion effect
    useEffect(() => {
        if (!evilRef.current) return;

        const el = evilRef.current;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = cursor.x - centerX;
        const dy = cursor.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only react if cursor is within 300px
        if (distance < 300) {
            const angle = Math.atan2(dy, dx);
            const repelStrength = (300 - distance) / 4; // closer = stronger push
            const offsetX = -Math.cos(angle) * repelStrength;
            const offsetY = -Math.sin(angle) * repelStrength;

            gsap.to(el, {
                x: offsetX,
                y: offsetY,
                duration: 0.3,
                ease: "power2.out",
            });
        } else {
            // Return to center when cursor far
            gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "power2.inOut" });
        }
    }, [cursor]);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
            <div
                ref={evilRef}
                className="absolute flex flex-col gap-2 items-center justify-center pointer-events-none opacity-0 text-foreground z-10"
            >
                <Button
                    href="/"
                    ref={buttonRef}
                    text="Go Back"
                    variant="1"
                    className="mt-8 px-6 py-3 bg-foreground text-background hover:rounded-3xl font-bold rounded-lg transition-all duration-500"
                ></Button>
            </div>
            <div className="flex flex-col items-center justify-center text-center w-full overflow-hidden relative">
                <div className="flex flex-col md:flex-row items-center justify-center font-bebas bg-gradient-to-l from-transparent via-background to-transparent backdrop-blur-lg text-foreground z-10 px-20 transition-all duration-100">
                    <span className="digit text-[16rem] md:text-[24rem] leading-[1] md:leading-[1] font-bold tracking-tighter">
                        4
                    </span>
                    <span className="digit text-[16rem] md:text-[24rem] leading-[1] md:leading-[1] font-bold tracking-tighter mx-4">
                        0
                    </span>
                    <span className="digit text-[16rem] md:text-[24rem] leading-[1] md:leading-[1] font-bold tracking-tighter">
                        4
                    </span>
                </div>
                <div ref={linesRef} className="absolute w-[120%] flex flex-col gap-1">
                    <div className="h-1 w-full bg-foreground"></div>
                    <div className="h-1 w-full bg-foreground"></div>
                    <div className="h-1 w-full bg-foreground"></div>
                </div>
            </div>

            <p className="mt-4 text-center max-w-md text-lg md:text-xl">
                Page not found. Looks like you enjoy pushing the limits and have reached the void of creativeness, wanna
                head back?
            </p>
            <Button
                href="/"
                ref={buttonRef}
                text="Go Back"
                variant="1"
                className="mt-8 px-6 py-3 bg-foreground text-background hover:rounded-3xl font-bold rounded-lg transition-all duration-500"
            ></Button>
        </div>
    );
}
