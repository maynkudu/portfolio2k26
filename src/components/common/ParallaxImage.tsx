"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { ImageProps } from "next/image";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps extends ImageProps {
    /** how much percentage the image moves (default = 20) */
    offset?: number;
}

export default function ParallaxImage({ offset = 20, alt, className = "", ...props }: ParallaxImageProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!containerRef.current || !imageRef.current) return;

            gsap.set(imageRef.current, { scale: 1.1, yPercent: offset });

            gsap.to(imageRef.current, {
                yPercent: -offset,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [offset]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden will-change-transform ${className}`}>
            <div ref={imageRef} className="absolute inset-0 will-change-transform">
                <Image {...props} alt={alt} priority fill className="object-cover scale-110" />
            </div>
        </div>
    );
}
