"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { BsGithub, BsInstagram, BsLinkedin, BsTwitterX } from "react-icons/bs";

export const socials = [
    {
        title: "Github",
        icon: <BsGithub />,
        href: "https://github.com/maynkudu",
    },
    {
        title: "LinkedIn",
        icon: <BsLinkedin />,
        href: "https://linkedin.com/maynkudu",
    },
    {
        title: "X",
        icon: <BsTwitterX />,
        href: "https://x.com/maynkudu",
    },
    {
        title: "Instagram",
        icon: <BsInstagram />,
        href: "https://instagram.com/maynkudu",
    },
];

const Footer = () => {
    const pathname = usePathname();
    const validPath = ["/", "/work", "/about"];

    const lenis = useLenis();

    const containerRef = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            gsap.fromTo(
                containerRef.current,
                {
                    y: -100,
                },
                {
                    y: 0,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 90%",
                        end: "bottom 80%",
                        scrub: 1,
                    },
                }
            );
        },
        {
            scope: containerRef,
        }
    );

    if (!validPath.includes(pathname)) return;
    return (
        <div ref={containerRef} className="flex bg-foreground text-background p-10 min-h-[50svh] w-full">
            {/* Title  */}
            <div className="flex flex-col justify-center flex-3/5">
                {/* Sub Title */}
                <div className="flex flex-col text-5xl font-qwigley">
                    <span className="font-style-script">Designer</span>
                    <span>& Developer</span>
                </div>
                <div className="relative h-[18em] w-[40em]">
                    <Image src={"/maynkudu_logo.png"} priority alt="logo" className="object-contain" fill />
                </div>
            </div>
            <div
                className="flex-1/5 max-h-max max-w-max uppercase flex justify-center items-center gap-1 cursor-pointer"
                onClick={() => lenis?.scrollTo(0, { duration: 5, easing: x => 1 - Math.pow(1 - x, 3) })}
            >
                <span>Scroll Up</span>
                <ArrowLeft className="h-5 w-5 rotate-45" />
            </div>
            <div className="flex-1/5 flex flex-col gap-5 items-end uppercase">
                <div className="flex flex-col items-end">
                    <span className="">Get in touch</span>
                    <span className="text-background/60">manykudu@gmail.com</span>
                </div>
                <div className="flex flex-col items-end">
                    <span>Socials</span>
                    <div className="flex gap-2">
                        {socials.map((item, idx) => (
                            <Link href={item.href} key={idx}>
                                {item.icon}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
