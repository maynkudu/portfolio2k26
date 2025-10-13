"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

export interface NavbarProps {
    logo: string;
    logoAlt?: string;
    className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
    const pathname = usePathname();
    const validPath = ["/", "/work", "/about"];

    if (!validPath.includes(pathname)) return;

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:block">
                <DesktopNav className={className} />
            </div>

            {/* Mobile Navigation */}
            <div className="block md:hidden">
                <MobileNav className={className} />
            </div>
        </>
    );
};

export default Navbar;
