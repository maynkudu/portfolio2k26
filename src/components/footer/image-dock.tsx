"use client";

import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

const ImageDock = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRefs = useRef<HTMLDivElement[]>([]);

    useGSAP(
        () => {
            gsap.set(imageRefs.current, { scale: "20rem" });
        },
        { scope: containerRef }
    );

    const handleHover = (index: number) => {
        imageRefs.current.forEach((el, i) => {
            if (!el) return;
            const height = i === index ? "30rem" : i === index - 1 || i === index + 1 ? "25rem" : "20rem";
            const y = i === index ? -50 : i === index - 1 || i === index + 1 ? -30 : 0;
            gsap.to(el, {
                height,
                y,
                duration: 0.3,
                ease: "power3.out",
            });
        });
    };

    const handleLeave = () => {
        gsap.to(imageRefs.current, {
            height: "20rem",
            y: 0,
            duration: 0.3,
            ease: "power3.out",
            // delay: 1,
        });
    };

    return (
        <div ref={containerRef} className="flex justify-center items-end gap-5 p-5 h-[30rem]">
            {services.map((img, idx) => (
                <div
                    key={idx}
                    ref={el => {
                        if (el) imageRefs.current[idx] = el;
                    }}
                    className={cn("relative h-80 w-80 cursor-pointer transition-transform")}
                    onMouseEnter={() => handleHover(idx)}
                    onMouseLeave={handleLeave}
                >
                    <Image src={img} alt={`service-${idx}`} fill className="object-cover rounded-2xl" />
                </div>
            ))}
        </div>
    );
};

export default ImageDock;
