"use client";

import { services } from "@/lib/services";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";
import ParallaxImage from "../common/ParallaxImage";
import LandingPage from "./landing-page";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomePage() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const newSectionRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const transitionRef = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=400%",
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                },
            });

            gsap.set(transitionRef.current, { x: "140vw", y: "140vh", rotate: 45 });
            gsap.set(newSectionRef.current, { x: "100vw" });

            tl.to(transitionRef.current, { x: "0vw", y: "0vh", duration: 0.5 }, 0);

            tl.fromTo(
                contentRef.current,
                { rotate: 0, scale: 3 },
                { rotate: -45, scale: 0.9, duration: 0.5 }, // duration relative to timeline
                0
            );

            tl.to(sectionRef.current, { scale: 0.7, opacity: 0 }, 0.5);
            tl.to(newSectionRef.current, { x: "0vw" }, 0.5);
            tl.to(transitionRef.current, { scale: 0.7, x: 300, ease: "power3.out", duration: 0.6 }, 0.5);
            tl.to(transitionRef.current, { opacity: 0, duration: 0.01 }, 0.99);

            return () => {
                tl.scrollTrigger?.kill();
                tl.kill();
            };
        },
        { scope: containerRef }
    );

    return (
        <main ref={containerRef} className="relative min-h-screen overflow-hidden">
            <section ref={sectionRef} className="absolute inset-0 flex items-center justify-center">
                <LandingPage />
            </section>

            <section
                ref={newSectionRef}
                className="absolute inset-0 flex items-center justify-center z-3 bg-background"
            >
                NewPage
            </section>

            <div
                ref={transitionRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-2 bg-primary flex justify-center items-center overflow-hidden"
                style={{
                    width: "200vmax",
                    height: "200vmax",
                    transformOrigin: "50% 50%",
                }}
            >
                <div ref={contentRef} className="flex flex-col gap-10" style={{ transformOrigin: "50% 50%" }}>
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-[10rem] leading-[0.9] font-bebas text-background">Design & Develop</h2>
                        <div className="flex justify-center">
                            {services.map((image, index) => (
                                <ParallaxImage
                                    key={index}
                                    offset={index % 2 == 0 ? 10 : -10}
                                    src={image}
                                    alt={`${index + 1}`}
                                    className="h-[40rem] w-[35rem]"
                                />
                            ))}
                            {services.map((image, index) => (
                                <ParallaxImage
                                    offset={index % 2 == 0 ? -10 : 10}
                                    key={index}
                                    src={image}
                                    alt={`${index + 1}`}
                                    className="h-[40rem] w-[35rem] object-cover"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
