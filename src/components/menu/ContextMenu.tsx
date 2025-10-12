"use client";

import useMousePosition from "@/hooks/useMousePosition";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bs0Circle, BsArrowLeft } from "react-icons/bs";
import { HiMoon, HiRefresh, HiSun, HiX } from "react-icons/hi";

export default function ContextMenu() {
    const [isVisible, setIsVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { resolvedTheme, setTheme } = useTheme();
    const router = useRouter();

    const mousePos = useMousePosition();

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setMenuPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);

            requestAnimationFrame(() => {
                if (menuRef.current) {
                    const menu = menuRef.current;
                    const items = Array.from(menu.children) as HTMLElement[];

                    // Reset to collapsed state
                    gsap.set(menu, {
                        scale: 0.5,
                        opacity: 0,
                        transformOrigin: "top left",
                    });

                    // Expand menu container
                    gsap.to(menu, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.35,
                        ease: "power3.out",
                    });

                    const tl = gsap.timeline();

                    tl.fromTo(
                        items,
                        { x: -50, opacity: 0, color: "#ffffff40" },
                        {
                            x: 0,
                            opacity: 1,
                            color: "#ffffff",
                            duration: 0.8,
                            stagger: 0.2,
                            ease: "power2.out",
                        }
                    );

                    tl.to(items, { color: "#ffffffb0", duration: 0.3, ease: "none" });

                    items.forEach((item, i) => {
                        const icon = item.querySelector(".icon svg");
                        if (icon) {
                            tl.fromTo(
                                icon,
                                { rotate: -180, opacity: 0 },
                                { rotate: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                                i * 0.2
                            );
                        }
                    });
                }
            });
        };

        const handleClick = () => {
            if (isVisible && menuRef.current) {
                const menu = menuRef.current;
                const items = Array.from(menu.children) as HTMLElement[];

                // Retract items
                gsap.to(items, {
                    x: -10,
                    opacity: 0,
                    duration: 0.2,
                    stagger: 0.05,
                    ease: "power2.in",
                });

                // Shrink menu
                gsap.to(menu, {
                    x: mousePos.x - menuPosition.x,
                    y: mousePos.y - menuPosition.y,
                    scale: 0.6,
                    opacity: 0,
                    duration: 0.25,
                    ease: "power3.in",
                    onComplete: () => setIsVisible(false),
                });

                // Icon spin-out
                items.forEach(item => {
                    const icon = item.querySelector(".icon svg");
                    if (icon) {
                        gsap.to(icon, {
                            rotate: 45,
                            duration: 0.25,
                            ease: "power1.inOut",
                        });
                    }
                });
            }
        };

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("click", handleClick);
        };
    }, [isVisible, mousePos, menuPosition]);

    return (
        <>
            {isVisible && (
                <div
                    ref={menuRef}
                    className="fixed z-[9999] bg-zinc-900 text-white shadow-lg rounded-xl w-48 p-2 flex flex-col justify-between gap-1 border border-zinc-800 origin-top-left overflow-hidden"
                    style={{
                        top: `${menuPosition.y}px`,
                        left: `${menuPosition.x}px`,
                    }}
                >
                    <MenuItem icon={<HiRefresh />} label="Refresh" onClick={() => router.refresh()} />
                    <MenuItem icon={<BsArrowLeft />} label="Back" onClick={() => router.back()} />
                    <MenuItem
                        icon={resolvedTheme === "dark" ? <HiSun /> : <HiMoon />}
                        label={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                        onClick={toggleTheme}
                    />

                    <MenuItem icon={<Bs0Circle />} label="Void" onClick={() => router.push("/404")} />

                    <div className="h-[0.1rem] bg-white/10 w-full"></div>
                    <MenuItem icon={<HiX />} label="Close" />
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
    const itemRef = useRef<HTMLDivElement | null>(null);
    const iconRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        const el = itemRef.current;
        const iconEl = iconRef.current?.querySelector("svg");
        if (!el || !iconEl) return;

        const onEnter = () => {
            gsap.to(el, {
                scale: 1.05,
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                duration: 0.25,
                ease: "power3.out",
                overwrite: "auto",
            });

            gsap.to(iconEl, {
                rotate: 45,
                scale: 1.1,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        const onLeave = () => {
            gsap.to(el, {
                scale: 1,
                color: "#ffffffa0",
                backgroundColor: "transparent",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                duration: 0.25,
                ease: "power3.inOut",
                overwrite: "auto",
            });

            gsap.to(iconEl, {
                rotate: 0,
                scale: 1,
                duration: 0.25,
                ease: "power2.inOut",
                overwrite: "auto",
            });
        };

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);

        return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    const handleClick = () => {
        const el = itemRef.current;
        if (el) {
            gsap.to(el, {
                x: -10,
                opacity: 0,
                duration: 0.05,
                ease: "power3.out",
                onComplete: () => {
                    onClick?.();
                },
            });
        }
    };

    return (
        <div
            ref={itemRef}
            className="px-4 py-2 flex items-center gap-5 rounded-lg cursor-pointer select-none"
            onClick={handleClick}
        >
            <span ref={iconRef} className="icon flex items-center justify-center">
                {icon}
            </span>
            <span>{label}</span>
        </div>
    );
}
