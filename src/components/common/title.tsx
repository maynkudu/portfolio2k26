"use client";

import gsap, { ScrollTrigger, SplitText } from "gsap/all";
import { useEffect, useRef } from "react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface TitleProps {
    title: string;
    variant: "Slide On Scroll";
}

interface SlideOnScrollProps {
    title: string;
}

const Title = ({ title, variant }: TitleProps) => {
    return <SlideOnScroll title={title} />;
};

const SlideOnScroll = ({ title }: SlideOnScrollProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = "";
        const upperTitle = title.toUpperCase();

        // Create span per letter
        upperTitle.split("").forEach(letter => {
            const span = document.createElement("span");
            span.textContent = letter;
            span.className = "letter relative inline-block overflow-hidden";
            container.appendChild(span);
        });

        const split = new SplitText(container, { type: "chars" });

        split.chars.forEach((char, index) => {
            const wrapper = document.createElement("div");
            wrapper.style.display = "inline-block";
            // wrapper.style.overflow = "hidden";
            wrapper.style.height = "3em";
            char.parentNode?.replaceChild(wrapper, char);
            wrapper.appendChild(char);

            const letters: HTMLElement[] = [];
            for (let i = 0; i < 3; i++) {
                const dup = char.cloneNode(true) as HTMLElement;
                dup.style.display = "block";
                dup.style.position = "absolute";
                dup.style.top = `${(i - 1) * 0.75}em`;
                wrapper.appendChild(dup);
                letters.push(dup);
            }

            gsap.set(letters, (i: number) => ({
                y: (i - 1) * 100,
                opacity: i === 1 ? 1 : 0.6,
            }));

            const initialY = (Math.random() - 0.5) * 1000;

            gsap.fromTo(
                wrapper,
                { y: initialY },
                {
                    y: 0,
                    duration: 1.8,
                    ease: "power4.out",
                    delay: index * 0.05,
                    onComplete: () => {
                        gsap.to(wrapper, {
                            y: scrollY,
                            duration: 0.2,
                            ease: "none",
                            scrollTrigger: {
                                trigger: container,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1,
                            },
                        });
                    },
                }
            );
        });
    }, [title]);

    return (
        <div className="flex justify-center items-center mt-40 overflow-hidden">
            <div
                ref={containerRef}
                className="flex flex-wrap justify-center items-center -gap-[10em] text-[20rem] overflow-hidden max-h-[1em]"
            />
        </div>
    );
};

export default Title;
