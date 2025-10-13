"use client";

import HomePage from "@/components/home";

export default function Page() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <HomePage />
            <div className="min-h-screen">Some page</div>
        </main>
    );
}
