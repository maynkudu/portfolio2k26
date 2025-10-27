"use client";

import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";

gsap.registerPlugin(ScrollTrigger);

const work = [
    {
        title: "CapsuleCorps",
        image: services[0],
    },
    {
        title: "Kitse.in",
        image: services[1],
    },
    {
        title: "Xernia",
        image: services[2],
    },
    {
        title: "UGRFR",
        image: services[3],
    },
    {
        title: "Episodes",
        image: services[4],
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
    const currentIndexRef = useRef<number>(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    useGSAP(
        () => {
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
                        // ease: "power2.out",
                    });
                } else if (isPrev) {
                    gsap.to(el, {
                        y: -70,
                        scale: 0.6,
                        opacity: 0.6,
                        duration: 0.2,
                        // ease: "power2.out",
                    });
                } else if (isNext) {
                    gsap.to(el, {
                        y: 70,
                        scale: 0.6,
                        opacity: 0.6,
                        duration: 0.2,
                        // ease: "power2.out",
                    });
                } else if (isOver) {
                    gsap.to(el, {
                        y: -140,
                        scale: 0.5,
                        opacity: 0,
                        duration: 0.2,
                        // ease: "power2.out",
                    });
                } else if (isNotOver) {
                    gsap.to(el, {
                        y: 140,
                        scale: 0.5,
                        opacity: 0,
                        duration: 0.2,
                        // ease: "power2.out",
                    });
                }
            });
        },
        { scope: containerRef, dependencies: [currentIndex] }
    );

    useGSAP(() => {
        if (!containerRef.current || !contentRef.current) return;

        const imageContainers = gsap.utils.toArray<HTMLDivElement>(contentRef.current.querySelectorAll(".image-panel"));
        const innerImages = gsap.utils.toArray<HTMLImageElement>(contentRef.current.querySelectorAll(".inner-image"));

        gsap.set(imageContainers, { yPercent: 100 });
        gsap.set(imageContainers[0], { yPercent: 0 });

        const totalPanels = imageContainers.length;
        const durationPerPanel = 1;
        const pauseDuration = 0.5;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: () => `+=${(totalPanels + pauseDuration) * window.innerHeight}`,
                scrub: 0.7,
                pin: true,
                anticipatePin: 1,
                onUpdate: self => {
                    const progress = self.progress;
                    const containerHeight = window.innerHeight;
                    const visibilityThreshold = containerHeight * 0.5;

                    let newIndex = 0;
                    imageContainers.forEach((panel, i) => {
                        const rect = panel.getBoundingClientRect();
                        if (rect.top <= visibilityThreshold && rect.bottom >= visibilityThreshold) {
                            newIndex = i;
                        }
                    });

                    if (newIndex !== currentIndexRef.current) {
                        currentIndexRef.current = newIndex;
                        setCurrentIndex(newIndex);
                    }
                },
            },
        });

        imageContainers.forEach((panel, i) => {
            if (i === 0) return;

            // Slide the next panel in
            tl.to(
                panel,
                {
                    yPercent: 0,
                    ease: "power2.inOut",
                    duration: durationPerPanel,
                },
                (i - 1) * durationPerPanel
            );
            const img = innerImages[i];

            tl.fromTo(
                img,
                { y: -500, scale: 1 },
                {
                    y: 0,
                    scale: 1.05,
                    ease: "power1.inOut",
                    duration: durationPerPanel - 0.1,
                },
                (i - 1) * durationPerPanel
            );
        });

        tl.to({}, { duration: pauseDuration });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
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
                <div className="flex-1 relative h-[80svh] flex items-center justify-center rounded-4xl overflow-hidden antialiased">
                    <div ref={contentRef} className="relative w-full h-full">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className="image-panel absolute inset-0 w-full h-full flex items-center justify-center"
                            >
                                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-4xl scale-101">
                                    <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.title}
                                        fill
                                        className="w-full h-full object-cover rounded-4xl inner-image"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="absolute bottom-0 left-0 right-0 text-white flex bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-4xl">
                            <Link
                                href={`/work/${work[currentIndexRef.current].title.toLocaleLowerCase()}`}
                                className="border-b border-b-white flex justify-center items-center"
                            >
                                <BsArrowLeft className="rotate-45 h-4 w-4" />
                                <p className="text-white/80 text-sm">Visit Now</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
