"use client";

import { services } from "@/lib/services";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef } from "react";

const ImageDock = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const currentIndex = useRef(null);
    return (
        <div className="flex justify-center items-center gap-5 p-5">
            {services.map((img, idx) => (
                <div className={cn("relative", "h-80 w-80")} key={idx}>
                    <Image src={img} alt={img} className="object-cover" fill />
                </div>
            ))}
        </div>
    );
};

export default ImageDock;
