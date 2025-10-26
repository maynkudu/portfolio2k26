"use client";

import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const work = [
    {
        title: "CapsuleCorps",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop",
    },
    {
        title: "Kitse.in",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop",
    },
    {
        title: "Xernia",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop",
    },
    {
        title: "UGRFR",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop",
    },
    {
        title: "TodayInEpisodes",
        image: "https://images.unsplash.com/photo-1533928298208-27ff66555d0d?w=1200&h=800&fit=crop",
    },
];

export default function LandingWorkPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !bgRef.current) return;

        gsap.fromTo(
            bgRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "top+=10 top",
                    scrub: true,
                },
            }
        );
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-[500svh] w-full text-background overflow-hidden">
            <div ref={bgRef} className="absolute inset-0 bg-foreground opacity-0 will-change-opacity" />
            <SwipeSection items={work} />
        </div>
    );
}

interface SwipeSectionProps {
    items: { title: string; image: string }[];
}

function SwipeSection({ items }: SwipeSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRefs = useRef<HTMLDivElement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useLayoutEffect(() => {
        titleRefs.current.forEach((el, i) => {
            if (!el) return;

            const isPrev = i === currentIndex - 1;
            const isNext = i === currentIndex + 1;
            const isCurrent = i === currentIndex;

            if (!isPrev && !isNext && !isCurrent) {
                gsap.to(el, { y: 0, opacity: 0, scale: 0.8, duration: 0.3 });
                return;
            }

            const y = isPrev ? -24 : isNext ? 24 : 0;
            const scale = isCurrent ? 1 : 0.8;
            const opacity = isCurrent ? 1 : 0.6;

            gsap.to(el, {
                y,
                scale,
                opacity,
                duration: 0.3,
                ease: "power2.out",
            });
        });
    }, [currentIndex]);

    useLayoutEffect(() => {
        if (!containerRef.current || !contentRef.current) return;

        const imageContainers = gsap.utils.toArray<HTMLDivElement>(contentRef.current.querySelectorAll(".image-panel"));

        gsap.set(imageContainers, { yPercent: 100, opacity: 1 });
        gsap.set(imageContainers[0], { yPercent: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: () => `+=${items.length * window.innerHeight}`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                onUpdate: self => {
                    // Calculate current index based on timeline progress
                    const progress = self.progress; // 0 -> 1
                    const index = Math.floor(progress * items.length);
                    setCurrentIndex(Math.min(index, items.length - 1));
                },
            },
        });

        imageContainers.forEach((panel, i) => {
            if (i === 0) return; // first image already in view
            tl.to(panel, { yPercent: 0, ease: "none" }, i * 1); // stagger each panel
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [items.length]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen flex items-center justify-center overflow-hidden text-foreground"
        >
            {/* Content wrapper */}
            <div className="relative w-full h-full flex items-center justify-center px-20 gap-10">
                {/* Left Panel */}
                <div className="flex-1 flex flex-col justify-around items-center gap-12 bg-amber-100 h-[80svh] rounded-2xl">
                    {/* Header */}
                    <div>
                        <span className="text-base font-medium tracking-widest uppercase">Featured Work</span>
                    </div>

                    <div className="relative h-32 overflow-hidden flex flex-col items-center justify-center">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                ref={el => {
                                    titleRefs.current[i] = el!;
                                }}
                                className={cn("absolute text-center transition-all")}
                            >
                                {item.title}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <div className="space-x-2 flex">
                            {items.map((item, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "text-sm font-medium transition-all duration-300 relative pl-4",
                                        i === currentIndex
                                            ? "text-foreground opacity-100"
                                            : "text-muted-foreground opacity-60 hover:opacity-80"
                                    )}
                                >
                                    {item.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Image Carousel */}
                <div className="flex-1 relative h-[80svh] flex items-center justify-center overflow-hidden">
                    <div ref={contentRef} className="relative w-full h-full">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className="image-panel absolute inset-0 w-full h-full flex items-center justify-center"
                            >
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={services[i] || "/placeholder.svg"}
                                        alt={item.title}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-2xl">
                                        <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-white/80 text-sm">
                                            Explore our latest work and creative solutions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
