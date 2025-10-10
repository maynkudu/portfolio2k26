"use client";

import gsap from "gsap";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { HiMoon, HiRefresh, HiSun } from "react-icons/hi";

export default function ContextMenu() {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { resolvedTheme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);

            requestAnimationFrame(() => {
                if (menuRef.current) {
                    const items = Array.from(menuRef.current.children) as HTMLElement[];
                    gsap.fromTo(
                        items,
                        { y: -20, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.4,
                            stagger: 0.08,
                            ease: "power3.out",
                        }
                    );

                    // Rotate icons individually
                    items.forEach(item => {
                        const icon = item.querySelector("svg");
                        if (icon) {
                            gsap.fromTo(icon, { rotate: -90 }, { rotate: 0, duration: 0.4, ease: "power3.out" });
                        }
                    });
                }
            });
        };

        const handleClick = () => {
            if (isVisible && menuRef.current) {
                const items = Array.from(menuRef.current.children) as HTMLElement[];
                gsap.to(items, {
                    y: -10,
                    opacity: 0,
                    duration: 0.25,
                    stagger: 0.05,
                    ease: "power2.in",
                    onComplete: () => setIsVisible(false),
                });
            }
        };

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("click", handleClick);
        };
    }, [isVisible]);

    return (
        <>
            {isVisible && (
                <div
                    ref={menuRef}
                    className="fixed z-[9999] bg-zinc-900 text-white shadow-lg rounded-xl w-48 p-2 border border-zinc-800"
                    style={{
                        top: `${position.y}px`,
                        left: `${position.x}px`,
                        transformOrigin: "top left",
                    }}
                >
                    <MenuItem icon={<HiRefresh />} label="Refresh" />
                    <MenuItem
                        icon={resolvedTheme === "dark" ? <HiSun /> : <HiMoon />}
                        label={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                        onClick={toggleTheme}
                    />
                    <MenuItem icon={<>❌</>} label="Close" />
                </div>
            )}
        </>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

function MenuItem({ icon, label, onClick }: MenuItemProps) {
    return (
        <div
            className="px-4 py-2 hover:bg-white/20 dark:hover:bg-white/10 flex items-center gap-3 rounded-lg cursor-pointer select-none"
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}
