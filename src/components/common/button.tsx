"use client";

import gsap from "gsap";
import Link from "next/link";
import { forwardRef } from "react";

interface ButtonProps {
    text: string;
    icon?: React.ReactNode;
    className?: string;
    href: string;
    variant: "1" | "2" | "3";
}

const Button = forwardRef<HTMLAnchorElement, ButtonProps>(({ text, icon, className = "", href }, ref) => {
    const onMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref || !(ref as React.RefObject<HTMLAnchorElement>).current) return;
        gsap.to((ref as React.RefObject<HTMLAnchorElement>).current, {
            borderRadius: "50px",
            duration: 0.1,
            ease: "power1.out",
        });
    };

    const onMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref || !(ref as React.RefObject<HTMLAnchorElement>).current) return;
        gsap.to((ref as React.RefObject<HTMLAnchorElement>).current, {
            borderRadius: "10px",
            duration: 0.1,
            ease: "power1.in",
        });
    };

    return (
        <Link
            href={href}
            ref={ref}
            className={`
                    inline-flex items-center gap-2 
                    px-4 py-2 sm:px-6 sm:py-3 
                    text-sm sm:text-base md:text-lg 
                    font-medium transition-all
                    ${className}
                `}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {icon}
            {text}
        </Link>
    );
});

Button.displayName = "Button";

export default Button;
