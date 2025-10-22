"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import React, { cloneElement, isValidElement, type ReactElement, type ReactNode, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface AnimatedText01Props {
    children: ReactNode | ReactElement;
    colorInitial?: string;
    colorAccent?: string;
    colorFinal?: string;
}

interface SplitTextInstance {
    chars: Element[];
    words: Element[];
    revert?: () => void;
}

const AnimatedText01 = ({
    children,
    colorInitial = "#dddddd",
    colorAccent = "#abff02",
    colorFinal = "#000000",
}: AnimatedText01Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const splitRef = useRef<{ wordSplit: SplitTextInstance; charSplit: SplitTextInstance }[]>([]);
    const lastScrollProgress = useRef(0);
    const colorTransitionTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const completedChars = useRef<Set<number>>(new Set());

    useGSAP(
        () => {
            if (!containerRef.current) return;

            splitRef.current = [];
            lastScrollProgress.current = 0;
            colorTransitionTimers.current.clear();
            completedChars.current.clear();

            const elements: Element[] = containerRef.current.hasAttribute("data-copy-wrapper")
                ? Array.from(containerRef.current.children)
                : [containerRef.current];

            elements.forEach(element => {
                const wordSplit = new SplitText(element, { type: "words", wordsClass: "word" }) as SplitTextInstance;
                const charSplit = new SplitText(wordSplit.words, {
                    type: "chars",
                    charsClass: "char",
                }) as SplitTextInstance;

                splitRef.current.push({ wordSplit, charSplit });
            });

            const allChars = splitRef.current.flatMap(({ charSplit }) => charSplit.chars as HTMLElement[]);

            gsap.set(allChars, { color: colorInitial });

            const scheduleFinalTransition = (char: HTMLElement, index: number) => {
                const oldTimer = colorTransitionTimers.current.get(index);
                if (oldTimer) clearTimeout(oldTimer);

                const timer = setTimeout(() => {
                    if (!completedChars.current.has(index)) {
                        gsap.to(char, {
                            duration: 0.1,
                            ease: "none",
                            color: colorFinal,
                            onComplete: () => {
                                completedChars.current.add(index);
                            },
                        });
                    }
                    colorTransitionTimers.current.delete(index);
                }, 100);

                colorTransitionTimers.current.set(index, timer);
            };

            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top 90%",
                end: "top 10%",
                scrub: 1,
                onUpdate: self => {
                    const progress = self.progress;
                    const totalChars = allChars.length;
                    const isScrollingDown = progress >= lastScrollProgress.current;
                    const currentCharIndex = Math.floor(progress * totalChars);

                    allChars.forEach((char, index) => {
                        if (!isScrollingDown && index >= currentCharIndex) {
                            const t = colorTransitionTimers.current.get(index);
                            if (t) clearTimeout(t);
                            colorTransitionTimers.current.delete(index);
                            completedChars.current.delete(index);
                            gsap.set(char, { color: colorInitial });
                            return;
                        }

                        if (completedChars.current.has(index)) return;

                        if (index <= currentCharIndex) {
                            gsap.set(char, { color: colorAccent });
                            if (!colorTransitionTimers.current.has(index)) scheduleFinalTransition(char, index);
                        } else {
                            gsap.set(char, { color: colorInitial });
                        }
                    });

                    lastScrollProgress.current = progress;
                },
            });

            return () => {
                colorTransitionTimers.current.forEach(timer => clearTimeout(timer));
                colorTransitionTimers.current.clear();
                completedChars.current.clear();

                splitRef.current.forEach(({ wordSplit, charSplit }) => {
                    charSplit?.revert?.();
                    wordSplit?.revert?.();
                });
            };
        },
        { scope: containerRef, dependencies: [colorInitial, colorAccent, colorFinal] }
    );

    if (React.Children.count(children) === 1 && isValidElement(children)) {
        return cloneElement(
            children as ReactElement<React.HTMLAttributes<HTMLDivElement>>,
            {
                ref: containerRef,
            } as React.HTMLAttributes<HTMLDivElement>
        );
    }

    return (
        <div ref={containerRef} data-copy-wrapper="true">
            {children}
        </div>
    );
};

interface AnimatedText02Props {
    children: ReactNode;
    fromOpacity?: number;
    fromRotateX?: number; // changed fromSkew to fromRotateX
    duration?: number;
    stagger?: number;
    type?: "word" | "letter" | "none"; // new prop
}

const AnimatedText02 = ({
    children,
    fromOpacity = 0,
    fromRotateX = -90,
    duration = 0.6,
    stagger = 0.1,
    type = "none",
}: AnimatedText02Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            // pick elements to animate
            let elements: Element[] = [];

            // if wrapper contains multiple children, animate each child separately
            if (containerRef.current.hasAttribute("data-copy-wrapper")) {
                elements = Array.from(containerRef.current.children);
            } else {
                elements = [containerRef.current];
            }

            // Animate
            gsap.fromTo(
                elements,
                { opacity: fromOpacity, rotateX: fromRotateX },
                {
                    opacity: 1,
                    rotateX: 0, // animate to normal
                    duration,
                    ease: "power2.out",
                    stagger,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        },
        { scope: containerRef, dependencies: [fromOpacity, fromRotateX, duration, stagger, type] }
    );

    // --- splitting logic ---
    // We convert children to text nodes and wrap them for animation
    const processChildren = () => {
        if (typeof children !== "string") return children;

        switch (type) {
            case "word":
                return children.split(" ").map((word, i) => (
                    <span key={i} className="inline-block will-change-transform">
                        {word}&nbsp;
                    </span>
                ));
            case "letter":
                return children.split("").map((letter, i) => (
                    <span key={i} className="inline-block will-change-transform">
                        {letter}
                    </span>
                ));
            default:
                return children;
        }
    };

    if (React.Children.count(children) === 1 && isValidElement(children) && type === "none") {
        return cloneElement(
            children as ReactElement<React.HTMLAttributes<HTMLDivElement>>,
            {
                ref: containerRef,
            } as React.HTMLAttributes<HTMLDivElement>
        );
    }

    return (
        <div ref={containerRef} data-copy-wrapper="true">
            {processChildren()}
        </div>
    );
};

interface AnimatedText03Props {
    text: string;
    className?: string;
    duration?: number;
    stagger?: number;
}

const AnimatedText03 = ({ text, duration = 1.2, stagger = 0.1, className }: AnimatedText03Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            // Animate
            gsap.fromTo(
                containerRef.current,
                { translateY: 100 },
                {
                    translateY: 0,
                    duration,
                    ease: "power2.out",
                    stagger,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        },
        { scope: containerRef, dependencies: [duration, stagger] }
    );

    return (
        <div className={cn("overflow-hidden", className)}>
            <div ref={containerRef}>
                <span>{text}</span>
            </div>
        </div>
    );
};

export { AnimatedText01, AnimatedText02, AnimatedText03 };
