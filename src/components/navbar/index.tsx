"use client";

import Link from "next/link";

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
    return (
        <div>
            <ul>
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
