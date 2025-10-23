"use client";

import ImageDock from "@/components/footer/image-dock";
import HomePage from "@/components/home";

export default function Page() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <HomePage />
            <div className="min-h-screen text-foreground/90 bg-background">Some page</div>
            <ImageDock />
        </main>
    );
}
