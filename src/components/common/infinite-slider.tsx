"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
    images: string[];
    speed?: number;
    height?: string;
    alt?: string;
};

export default function InfiniteSlider({ images, speed = 100, height = "300px", alt = "slide" }: Props) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);

    const duplicatedImages = [...images, ...images];
    const gap = 40;

    useEffect(() => {
        if (!wrapperRef.current || !trackRef.current) return;

        const track = trackRef.current;

        const slideEls = Array.from(track.children) as HTMLElement[];
        const slideWidth = slideEls[0].getBoundingClientRect().width + gap;
        const totalWidth = slideWidth * images.length;

        gsap.set(track, { x: 0 });

        const tl = gsap.to(track, {
            x: `-=${totalWidth}`,
            duration: totalWidth / speed,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: x => {
                    let val = parseFloat(x);
                    if (val <= -totalWidth) val += totalWidth;
                    return `${val}px`;
                },
            },
            onUpdate: () => {
                const wrapperRect = wrapperRef.current!.getBoundingClientRect();
                const centerX = wrapperRect.left + wrapperRect.width / 2;

                slideEls.forEach(slide => {
                    const slideRect = slide.getBoundingClientRect();
                    const distanceFromCenter = slideRect.left + slideRect.width / 2 - centerX;
                    const norm = distanceFromCenter / (wrapperRect.width / 2);

                    const curveY = Math.pow(norm, 2) * 100; // vertical curve
                    const rotateZ = norm * 20; // tilt

                    gsap.set(slide, {
                        y: curveY,
                        rotateZ,
                        scale: 1 - Math.abs(norm) * 0.1,
                        zIndex: 100 - Math.abs(norm) * 50,
                    });
                });
            },
        });

        return () => {
            tl.kill();
        };
    }, [images, speed]);

    return (
        <div
            ref={wrapperRef}
            className="infinite-slider relative w-full min-h-screen overflow-hidden flex items-center justify-start"
        >
            <div
                ref={trackRef}
                className="slider-track flex items-center gap-[40px]"
                style={{ position: "relative", width: "max-content" }}
            >
                {duplicatedImages.map((src, i) => (
                    <div
                        key={`${src}-${i}`}
                        className="slide flex-shrink-0 bg-black rounded-2xl relative overflow-hidden"
                        style={{
                            display: "inline-block",
                            width: "400px",
                            height: "300px",
                            transformOrigin: "right right",
                        }}
                    >
                        <Image
                            fill
                            className="object-cover"
                            priority
                            src={src}
                            alt={`${alt} ${(i % images.length) + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
