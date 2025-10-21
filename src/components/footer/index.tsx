"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    return (
        <div className="flex bg-foreground text-background p-10 min-h-[50svh] w-full">
            {/* Title  */}
            <div className="flex flex-col justify-center flex-3/5">
                {/* Sub Title */}
                <div className="flex flex-col text-5xl font-qwigley">
                    <span className="font-style-script">Designer</span>
                    <span>& Developer</span>
                </div>
                <div className="relative h-[18em] w-[40em]">
                    <Image src={"/maynkudu_logo.png"} alt="logo" className="object-contain" fill />
                </div>
            </div>
            <div className="flex-1/5 max-h-max uppercase flex justify-center items-center gap-1">
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
