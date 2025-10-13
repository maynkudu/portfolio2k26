"use client";

import { cn } from "@/lib/utils";

const LandingPage = () => {
    return (
        <div className="bg-black/30 rounded-2xl p-5 min-h-[98svh] w-[99%] grid grid-cols-5 grid-rows-2 tracking-tighter">
            <div className={cn("col-span-3", "border mt-10", "flex flex-col justify-center")}>
                <span className={cn("font-bebas text-9xl")}>
                    Protagnist <br />
                    Syndrome
                </span>
                <div className="text-4xl flex gap-1 tracking-tight">
                    <span>checkout my</span>
                    <span>Art</span>
                </div>
            </div>
            <div className={cn("col-span-2 row-span-1", "border mt-10")}></div>
            <div className={cn("col-span-1 row-span-1", "border")}></div>
            <div className={cn("col-span-2 row-span-1", "border")}></div>
            <div className={cn("col-span-2 row-span-1", "border")}></div>
        </div>
    );
};

export default LandingPage;
