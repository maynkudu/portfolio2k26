"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface DesktopNavProps {
    className?: string;
}

interface DropdownItem {
    title: string;
    href: string;
    subitems?: string[];
    color?: string;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ className = "" }) => {
    const navRef = useRef<HTMLDivElement | null>(null);
    const navItemsContainerRef = useRef<HTMLDivElement | null>(null);
    const lastScrollY = useRef(0);
    const [isTransparent, setIsTransparent] = useState(true);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [floatingPillStyle, setFloatingPillStyle] = useState<React.CSSProperties>({});
    const [showFloatingPill, setShowFloatingPill] = useState(false);
    const [dropdownContent, setDropdownContent] = useState<string[] | null>(null);
    const [hoveredServiceIndex, setHoveredServiceIndex] = useState(0);
    const [hoveredAboutIndex, setHoveredAboutIndex] = useState(0);

    const pathname = usePathname();
    const lightBackgroundRoutes = [""];
    const isLightBackgroundRoutes = lightBackgroundRoutes.includes(pathname);

    useEffect(() => {
        setHoveredItem(null);
        setDropdownContent(null);
        setShowFloatingPill(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setHoveredItem(null);
                setDropdownContent(null);
                setShowFloatingPill(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // const currentServiceImage =
    //     dropdownContent && dropdownContent.length > 0 ? dropdownContent[hoveredServiceIndex]?.image : null;

    // const currentAboutImage =
    //     dropdownContent && dropdownContent.length > 0 ? dropdownContent[hoveredAboutIndex]?.image : null;

    useEffect(() => {
        const navEl = navRef.current;
        if (!navEl) return;

        navEl.style.transform = "translateY(-100px)";
        navEl.style.transition = "transform 0.3s ease-out";

        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY < 10) {
                setIsTransparent(true);
                navEl.style.transform = "translateY(0)";
                lastScrollY.current = scrollY;
                return;
            }

            setIsTransparent(false);

            if (scrollY > lastScrollY.current) {
                // Scrolling down — hide navbar and close dropdown
                navEl.style.transform = "translateY(-100px)";
                // Only clear dropdown if the user scrolls significantly (optional)
                setHoveredItem(null);
                setDropdownContent(null);
                setShowFloatingPill(false);
            } else if (scrollY < lastScrollY.current) {
                // Scrolling up — show navbar
                navEl.style.transform = "translateY(0)";
                // Do NOT clear hoveredItem here
                // This allows the user to click the item again
            }

            lastScrollY.current = scrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const NavItems: DropdownItem[] = [
        { title: "Work", href: "/work", color: "#cd5c5c" },
        { title: "Blog", href: "/blog", color: "#cd5c5c" },
        { title: "About", href: "/about" },
    ];

    const handleItemHover = (title: string, e: React.MouseEvent<HTMLElement>) => {
        setHoveredItem(title);
        setShowFloatingPill(true);

        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const navRect = navItemsContainerRef.current?.getBoundingClientRect();

        if (navRect) {
            const newLeft = rect.left - navRect.left;
            const newWidth = rect.width;

            setFloatingPillStyle({
                left: newLeft,
                width: newWidth,
            });
        }

        const currentItem = NavItems.find(item => item.title === title);
        if (currentItem?.subitems) {
            setDropdownContent(currentItem.subitems);
        } else {
            setDropdownContent(null);
        }
    };

    const handleItemLeave = () => {
        setTimeout(() => {
            if (!hoveredItem) {
                setShowFloatingPill(false);
            }
        }, 100);
    };

    const handleNavLeave = () => {
        setHoveredItem(null);
        setShowFloatingPill(false);
        setDropdownContent(null);
    };

    const handleItemClick = (item: DropdownItem) => {
        if (item.subitems) {
            if (hoveredItem === item.title) {
                // Close if already open
                setHoveredItem(null);
                setDropdownContent(null);
                setShowFloatingPill(false);
            } else {
                // Open dropdown
                setHoveredItem(item.title);
                setDropdownContent(item.subitems);
                setShowFloatingPill(true);
            }
        } else {
            // Regular navigation for items without subitems
            setHoveredItem(null);
            setDropdownContent(null);
            setShowFloatingPill(false);
        }
    };

    // const renderDropdownContent = () => {
    //     if (hoveredItem === "Services") {
    //         return (
    //             <motion.div className="p-2 relative flex justify-between items-center space-x-10 tracking-tighter">
    //                 <div className="flex flex-col justify-center pl-20">
    //                     <div className="mb-4">
    //                         <h3 className="text-lg font-medium text-black/60">Our Services</h3>
    //                     </div>
    //                     {/* Grid */}
    //                     <motion.div className={cn("grid grid-cols-2 space-x-5 space-y-1")}>
    //                         {dropdownContent?.map((subitem: ServiceItem, index: number) => (
    //                             <motion.div
    //                                 key={`${subitem.title}-${index}`}
    //                                 initial={{ opacity: 0, x: -10 }}
    //                                 animate={{ opacity: 1, x: 0 }}
    //                                 transition={{
    //                                     duration: 0.2,
    //                                     delay: index * 0.05,
    //                                     ease: "easeOut",
    //                                 }}
    //                                 className="flex w-full"
    //                                 layout
    //                                 onMouseEnter={() => setHoveredServiceIndex(index)}
    //                             >
    //                                 <TransitionLink
    //                                     href={subitem.link}
    //                                     className="text-black group flex items-center gap-2"
    //                                     color={subitem.accent}
    //                                 >
    //                                     <div className="">
    //                                         <div className="font-medium text-2xl whitespace-nowrap">
    //                                             {subitem.title}
    //                                         </div>
    //                                     </div>
    //                                     <ArrowRight className="w-5 h-5 -rotate-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:-rotate-45 " />
    //                                 </TransitionLink>
    //                             </motion.div>
    //                         ))}
    //                     </motion.div>
    //                 </div>
    //                 {/* Image panel */}
    //                 <div className="w-80 h-80 relative overflow-hidden rounded-xl">
    //                     <AnimatePresence mode="wait">
    //                         {currentServiceImage && (
    //                             <motion.div
    //                                 key={currentServiceImage}
    //                                 initial={{ filter: "blur(12px)" }}
    //                                 animate={{ filter: "blur(0px)" }}
    //                                 exit={{ filter: "blur(12px)" }}
    //                                 transition={{ duration: 0.2, ease: "easeInOut" }}
    //                                 className="absolute inset-0"
    //                             >
    //                                 <Image
    //                                     src={currentServiceImage}
    //                                     alt="Service image"
    //                                     fill
    //                                     className="object-cover scale-110"
    //                                 />
    //                             </motion.div>
    //                         )}
    //                     </AnimatePresence>
    //                     <div className="z-50 absolute bottom-2 left-2">
    //                         <Button href={"/services"} className="bg-white text-black">
    //                             View All Services
    //                         </Button>
    //                     </div>
    //                 </div>
    //             </motion.div>
    //         );
    //     } else if (hoveredItem === "About") {
    //         return (
    //             <motion.div className="p-2 flex justify-center items-center">
    //                 <motion.div className={cn("grid grid-cols-1 gap-2")}>
    //                     {dropdownContent?.map((subitem: ServiceItem, index: number) => (
    //                         <motion.div
    //                             key={`${subitem.title}-${index}`}
    //                             initial={{ opacity: 0, y: 10 }}
    //                             animate={{ opacity: 1, y: 0 }}
    //                             transition={{
    //                                 duration: 0.3,
    //                                 delay: index * 0.1,
    //                                 ease: "easeOut",
    //                             }}
    //                             layout
    //                             onMouseEnter={() => setHoveredAboutIndex(index)}
    //                         >
    //                             <TransitionLink
    //                                 href={subitem.link}
    //                                 className="flex items-center gap-2 px-20 transition-all duration-200 text-black group"
    //                                 color={subitem.accent}
    //                             >
    //                                 <div className="">
    //                                     <div className="font-medium text-4xl tracking-tighter">{subitem.title}</div>
    //                                 </div>
    //                                 <ArrowRight className="w-7 h-7 -rotate-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:-rotate-45 " />
    //                             </TransitionLink>
    //                         </motion.div>
    //                     ))}
    //                 </motion.div>
    //                 {/* Image panel */}
    //                 <div className="w-80 h-80 relative overflow-hidden rounded-xl">
    //                     <AnimatePresence mode="wait">
    //                         {currentAboutImage && (
    //                             <motion.div
    //                                 key={currentAboutImage}
    //                                 initial={{ filter: "blur(12px)" }}
    //                                 animate={{ filter: "blur(0px)" }}
    //                                 exit={{ filter: "blur(12px)" }}
    //                                 transition={{ duration: 0.2, ease: "easeInOut" }}
    //                                 className="absolute inset-0"
    //                             >
    //                                 <Image
    //                                     src={currentAboutImage}
    //                                     alt="Service image"
    //                                     fill
    //                                     className="object-cover scale-110"
    //                                 />
    //                             </motion.div>
    //                         )}
    //                     </AnimatePresence>
    //                 </div>
    //             </motion.div>
    //         );
    //     }
    //     return null;
    // };

    return (
        <div
            ref={navRef}
            className={`fixed inset-x-0 top-0 z-[5000] py-2 px-2 ${className} font-medium tracking-tighter  font-poppins `}
        >
            <nav
                className={cn(
                    "flex justify-between items-center h-16 relative px-2 mx-2 rounded-full transition-all duration-200 tracking-tighter",
                    isTransparent
                        ? isLightBackgroundRoutes
                            ? "text-white bg-transparent"
                            : "text-black bg-transparent"
                        : "bg-white/60 backdrop-blur text-black"
                )}
                onMouseLeave={handleNavLeave}
            >
                <Link className="text-xl pl-2 font-medium" href="/">
                    Maynkudu
                </Link>

                <div className="flex items-center gap-8 relative" ref={navItemsContainerRef}>
                    {NavItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative"
                            onMouseEnter={e => handleItemHover(item.title, e)}
                            onMouseLeave={handleItemLeave}
                            onClick={() => handleItemClick(item)}
                        >
                            {item.subitems ? (
                                <div
                                    className={cn(
                                        "flex items-center gap-1 hover:opacity-80 transition-all duration-200 py-2 px-3 rounded-full relative z-10 cursor-pointer",
                                        hoveredItem === item.title ? "text-black" : "hover:opacity-80"
                                    )}
                                >
                                    <span>{item.title}</span>
                                    <motion.div
                                        animate={{ rotate: hoveredItem === item.title ? 45 : 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </motion.div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    color={item.color}
                                    className={cn(
                                        "flex items-center gap-1 hover:opacity-80 transition-all duration-200 py-2 px-3 rounded-full relative z-10",
                                        hoveredItem === item.title ? "text-black" : "hover:opacity-80"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            )}
                            {/* <TransitionLink
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-1 hover:opacity-80 transition-all duration-200 py-2 px-3 rounded-full relative z-10",
                                    hoveredItem === item.title ? "text-black" : "hover:opacity-80",
                                )}
                            >
                                <span className="font-medium">{item.title}</span>
                                {item.subitems && (
                                    <motion.div
                                        animate={{ rotate: hoveredItem === item.title ? 45 : 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </TransitionLink> */}
                        </div>
                    ))}

                    <AnimatePresence>
                        {showFloatingPill && (
                            <motion.div
                                className="absolute h-10 bg-white rounded-full shadow-lg"
                                style={{
                                    position: "absolute",
                                    top: "0%",
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    left: floatingPillStyle.left,
                                    width: floatingPillStyle.width,
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                layout
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* <AnimatePresence>
                    {dropdownContent && (
                        <motion.div
                            className={cn(
                                "fixed top-16 w-full pt-4 left-[50%] -translate-x-[50%]   z-[99999999999] max-w-max"
                            )}
                            initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(2px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            layout
                        >
                            <div
                                className="bg-white w-full rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                                style={{
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                                }}
                            >
                                {renderDropdownContent()}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence> */}

                <div className="">
                    <Link
                        href="/contact"
                        color="bg-orange-300"
                        className={cn(
                            "group bg-[#111212] rounded-4xl px-8 py-3 text-white font-medium font-poppins flex justify-center items-end transition-all duration-500 ease-in-out hover:rounded-xl",
                            isTransparent && isLightBackgroundRoutes && "text-black bg-white"
                        )}
                    >
                        <span>Contact</span>
                        <ArrowRight className="ml-2 -rotate-45 scale-75 transition-transform duration-500 ease-in-out group-hover:translate-x-2" />
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default DesktopNav;
