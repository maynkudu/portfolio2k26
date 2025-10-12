"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Animate the digits of "404"
        const digits = containerRef.current.querySelectorAll(".digit");
        gsap.fromTo(
            digits,
            { y: -200, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.2,
                duration: 1.2,
                ease: "power4.out",
            }
        );
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-800 text-white p-6">
            <div ref={containerRef} className="flex flex-col items-center justify-center text-center w-full">
                <div className="flex flex-col md:flex-row items-center justify-center">
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
            </div>

            <p className="mt-4 text-center max-w-md text-lg md:text-xl">
                Page not found. Looks like you enjoy pushing the limits and have reached the void of creativeness, wanna
                head back?
            </p>
            <Link
                href="/"
                className="mt-8 px-6 py-3 bg-white text-indigo-800 font-bold rounded-lg hover:bg-indigo-50 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}
