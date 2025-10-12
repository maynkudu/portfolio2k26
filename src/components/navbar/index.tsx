"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavRoutes = [
    {
        title: "Home",
        href: "/",
    },
    {
        title: "About",
        href: "/about",
    },
    {
        title: "Work",
        href: "/work",
    },
];

const Navbar = () => {
    const pathname = usePathname();
    const knownRoutes = ["/", "/work", "/about"];

    if (!knownRoutes.includes(pathname)) return;

    return (
        <div>
            <ul className="flex justify-center gap-5">
                {NavRoutes.map((route, index) => (
                    <li key={index}>
                        <Link href={route.href}>{route.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navbar;
