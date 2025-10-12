"use client";

import Link from "next/link";

export default function NotFound() {
    // const router = useRouter();
    // const pathname = usePathname();

    // if (pathname !== "/404") router.push("/404");
    // const containerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="flex flex-col items-center justify-center text-center w-full">
                <div className="flex flex-col md:flex-row items-center justify-center font-bebas">
                    <span className="digit text-[16rem] md:text-[24rem] leading-[1] md:leading-[1] font-bold tracking-tighter">
                        4
                    </span>
                    <span className="digit text-[16rem] md:text-[24rem] leading-[1] md:leading-[1] font-bold tracking-tighter mx-4">
                        0
                    </span>
                    <span className="digit text-[16rem] md:text-[24rem] leading-[1] md:leading-[1] font-bold tracking-tighter">
                        4
                    </span>
                </div>
            </div>

            <p className="mt-4 text-center max-w-md text-lg md:text-xl">
                Page not found. Looks like you enjoy pushing the limits and have reached the void of creativeness, wanna
                head back?
            </p>
            <Link
                href="/"
                className="mt-8 px-6 py-3 bg-white text-indigo-800 font-bold rounded-lg hover:bg-indigo-50 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}
