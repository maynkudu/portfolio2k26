"use client";

import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

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
        title: "Episodes",
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
    useGSAP(() => {
        titleRefs.current.forEach((el, i) => {
            if (!el) return;

            const isCurrent = i === currentIndex;
            const isPrev = i === currentIndex - 1;
            const isNext = i === currentIndex + 1;
            const isOver = i < currentIndex;
            const isNotOver = i > currentIndex;

            if (isCurrent) {
                gsap.to(el, {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.2,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            } else if (isPrev) {
                gsap.to(el, {
                    y: -70,
                    scale: 0.6,
                    opacity: 0.6,
                    duration: 0.2,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            } else if (isNext) {
                gsap.to(el, {
                    y: 70,
                    scale: 0.6,
                    opacity: 0.6,
                    duration: 0.2,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            } else if (isOver) {
                gsap.to(el, {
                    y: -140,
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            } else if (isNotOver) {
                gsap.to(el, {
                    y: 140,
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            }
        });
    }, [currentIndex]);

    useGSAP(() => {
        if (!containerRef.current || !contentRef.current) return;

        const imageContainers = gsap.utils.toArray<HTMLDivElement>(contentRef.current.querySelectorAll(".image-panel"));

        gsap.set(imageContainers, { yPercent: 100, opacity: 1 });
        gsap.set(imageContainers[0], { yPercent: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: () => `+=${items.length * window.innerHeight}`,
                scrub: 0.7,
                pin: true,
                anticipatePin: 1,
                onUpdate: () => {
                    let newIndex = 0;
                    const halfScreen = window.innerHeight / 2;

                    imageContainers.forEach((panel, i) => {
                        const rect = panel.getBoundingClientRect();

                        // Change index when the top of the panel is above half the screen
                        if (rect.top <= halfScreen) {
                            newIndex = i;
                        }
                    });

                    // Prevent index from jumping past last image
                    newIndex = Math.min(newIndex, items.length - 1);

                    console.log(newIndex);

                    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
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
                <div className="flex-1 flex flex-col justify-around items-center gap-12 bg-amber-100 h-[80svh] rounded-2xl p-10">
                    {/* Header */}
                    <div>
                        <span className="text-base font-medium tracking-widest uppercase">Featured Work</span>
                    </div>

                    <div className="relative flex-1 h-full w-full overflow-hidden flex flex-col items-center justify-center z-10">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                ref={el => {
                                    titleRefs.current[i] = el!;
                                }}
                                className={cn(
                                    "absolute text-center text-5xl tracking-tighter font-medium transition-all text-black z-10"
                                )}
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
