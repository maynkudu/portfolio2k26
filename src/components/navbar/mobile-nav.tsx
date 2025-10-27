"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface MobileNavProps {
    className?: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isTransparent, setIsTransparent] = useState(true);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const scrollYRef = useRef(0);
    const lastScrollY = useRef(0);

    const pathname = usePathname();
    const lightBackgroundRoutes = [""];
    const isLightBackgroundRoutes = lightBackgroundRoutes.includes(pathname);

    useEffect(() => {
        const handleScroll = () => {
            if (isOpen) return;

            const currentScrollY = window.scrollY;

            if (currentScrollY < 50) {
                setIsTransparent(true);
                setIsVisible(true);
            } else {
                setIsTransparent(false);
                if (currentScrollY > lastScrollY.current) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            scrollYRef.current = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollYRef.current}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";
        } else {
            const y = scrollYRef.current;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
            window.scrollTo(0, y);
            setExpandedSection(null);
        }

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <>
            <style jsx>{`
                .burger {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 22px;
                    height: 14px;
                    background: transparent;
                    cursor: pointer;
                    display: block;
                }

                .burger input {
                    display: none;
                }

                .burger span {
                    display: block;
                    position: absolute;
                    height: 2px;
                    width: 100%;
                    background: ${isOpen ? "white" : isTransparent && isLightBackgroundRoutes ? "white" : "black"};
                    border-radius: 2px;
                    opacity: 1;
                    left: 0;
                    transform: rotate(0deg);
                    transition: 0.25s ease-in-out;
                }

                .burger span:nth-of-type(1) {
                    top: 0px;
                    transform-origin: left center;
                }

                .burger span:nth-of-type(2) {
                    top: 50%;
                    transform: translateY(-50%);
                    transform-origin: left center;
                }

                .burger span:nth-of-type(3) {
                    top: 100%;
                    transform-origin: left center;
                    transform: translateY(-100%);
                }

                .burger input:checked ~ span:nth-of-type(1) {
                    transform: rotate(45deg);
                    top: 0px;
                    left: 4px;
                }

                .burger input:checked ~ span:nth-of-type(2) {
                    width: 0%;
                    opacity: 0;
                }

                .burger input:checked ~ span:nth-of-type(3) {
                    transform: rotate(-45deg);
                    top: 16px;
                    left: 4px;
                }
            `}</style>

            <motion.div
                className={cn("fixed inset-x-0 top-0 z-[99] font-poppins tracking-tighter", className)}
                initial={{ y: 0 }}
                animate={{
                    y: isVisible ? 0 : -100,
                    height: isOpen ? "98.1svh" : "64px",
                    margin: isOpen ? "0.5rem" : "0rem",
                }}
                transition={{
                    y: { duration: 0.6, ease: "easeInOut" },
                    height: { duration: 0.6, ease: "easeInOut" },
                    margin: { duration: 0.6, ease: "easeInOut" },
                }}
            >
                <motion.div
                    className={cn(
                        "w-full h-full relative overflow-hidden",
                        !isTransparent && "backdrop-blur-lg",
                        isOpen && "backdrop-blur-lg"
                    )}
                    animate={{
                        backgroundColor: isOpen
                            ? "rgba(0, 0, 0, 0.65)"
                            : isTransparent
                            ? "rgba(255, 255, 255, 0)"
                            : "rgba(255, 255, 255, 0.5)",
                        borderRadius: isOpen ? "1.5rem" : "0rem",
                        padding: isTransparent ? "0 15px 0 15px" : "0",
                    }}
                    transition={{
                        backgroundColor: { duration: 0.25, ease: "easeInOut" },
                        borderRadius: { type: "spring", stiffness: 260, damping: 22 },
                        padding: { type: "spring", stiffness: 280, damping: 20 },
                    }}
                >
                    {/* Header Bar - always visible */}
                    <div className="flex items-center justify-between h-16 px-4 relative z-10">
                        <motion.div
                            className="text-xl font-medium"
                            animate={{
                                color: isOpen ? "white" : isTransparent && isLightBackgroundRoutes ? "#fff" : "#000",
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link href="/">Capsule Corps.</Link>
                        </motion.div>
                        <label className="burger" htmlFor="mobile-burger">
                            <input
                                type="checkbox"
                                id="mobile-burger"
                                checked={isOpen}
                                onChange={e => setIsOpen(e.target.checked)}
                            />
                            <span></span>
                            <span></span>
                            <span></span>
                        </label>
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                                    },
                                }}
                                className="flex flex-col justify-between h-[88svh] px-4 mt-5 overflow-y-hidden"
                            >
                                {/* Navigation Items */}
                                <div className="space-y-1">
                                    <motion.div
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                    >
                                        <button
                                            onClick={() => toggleSection("services")}
                                            className="text-white text-4xl font-semibold tracking-tighter w-full text-left flex items-center justify-between"
                                        >
                                            Services
                                            <motion.div
                                                animate={{ rotate: expandedSection === "services" ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ChevronDown className="w-8 h-8" />
                                            </motion.div>
                                        </button>
                                        {/* <AnimatePresence>
                                            {expandedSection === "services" && (
                                                <motion.div
                                                    initial="collapsed"
                                                    animate="open"
                                                    exit="collapsed"
                                                    variants={{
                                                        open: {
                                                            height: "auto",
                                                            opacity: 1,
                                                            transition: {
                                                                duration: 0.6,
                                                                ease: "easeInOut",
                                                                staggerChildren: 0.15,
                                                                delayChildren: 0.1,
                                                            },
                                                        },
                                                        collapsed: {
                                                            height: 0,
                                                            opacity: 0,
                                                            transition: { duration: 0.4, ease: "easeInOut" },
                                                        },
                                                    }}
                                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="py-4 space-y-1">
                                                        {services.map(service => (
                                                            <motion.div
                                                                key={service.id}
                                                                variants={{
                                                                    open: { opacity: 1, y: 0 },
                                                                    collapsed: { opacity: 0, y: -10 },
                                                                }}
                                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                            >
                                                                <Link
                                                                    href={service.link}
                                                                    className="text-white text-xl font-semibold tracking-tighter block hover:text-white transition-colors"
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    {service.title}
                                                                </Link>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence> */}
                                    </motion.div>

                                    <motion.div
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                    >
                                        <button
                                            onClick={() => toggleSection("about")}
                                            className="text-white text-4xl font-semibold tracking-tighter w-full text-left flex items-center justify-between"
                                        >
                                            About
                                            <motion.div
                                                animate={{ rotate: expandedSection === "about" ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ChevronDown className="w-8 h-8" />
                                            </motion.div>
                                        </button>
                                        {/* <AnimatePresence>
                                            {expandedSection === "about" && (
                                                <motion.div
                                                    initial="collapsed"
                                                    animate="open"
                                                    exit="collapsed"
                                                    variants={{
                                                        open: {
                                                            height: "auto",
                                                            opacity: 1,
                                                            transition: {
                                                                duration: 0.6,
                                                                ease: "easeInOut",
                                                                staggerChildren: 0.15,
                                                                delayChildren: 0.1,
                                                            },
                                                        },
                                                        collapsed: {
                                                            height: 0,
                                                            opacity: 0,
                                                            transition: { duration: 0.4, ease: "easeInOut" },
                                                        },
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="py-4 space-y-1">
                                                        {aboutItems.map(item => (
                                                            <motion.div
                                                                key={item.id}
                                                                variants={{
                                                                    open: { opacity: 1, y: 0 },
                                                                    collapsed: { opacity: 0, y: -10 },
                                                                }}
                                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                            >
                                                                <Link
                                                                    href={item.link}
                                                                    className="text-white text-xl font-semibold tracking-tighter block hover:text-white transition-colors"
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence> */}
                                    </motion.div>

                                    {[
                                        { href: "/work", label: "Work", color: "#cd5c5c" },
                                        { href: "/careers", label: "Careers" },
                                        { href: "/blog", label: "Blog" },
                                        { href: "/webinar", label: "Webinar" },
                                    ].map(item => (
                                        <motion.div
                                            key={item.href}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 },
                                            }}
                                        >
                                            <Link
                                                href={item.href}
                                                color={item.color}
                                                className="text-white text-4xl font-semibold tracking-tighter block"
                                            >
                                                <div onClick={() => setIsOpen(false)}>{item.label}</div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Bottom Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="pb-8"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Link
                                        href="/contact"
                                        color="bg-white"
                                        className="w-full bg-white text-black text-center py-3 rounded-full font-medium tracking-tighter text-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                        Get In Touch
                                        <ArrowRight className="w-5 h-5 -rotate-45" />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </>
    );
};

export default MobileNav;
