"use client";

import gsap, { ScrollTrigger, SplitText } from "gsap/all";
import { useEffect, useRef } from "react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface TitleProps {
    title: string;
    variant: "Slide On Scroll";
}

const Title = ({ title }: TitleProps) => {
    return <SlideOnScroll title={title} />;
};

const SlideOnScroll = ({ title }: { title: string }) => {
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
            span.className = "letter relative flex justify-center  items-center bg-blue-600/0";
            container.appendChild(span);
        });

        const split = new SplitText(container, { type: "chars" });

        // ---- ENTRY ANIMATION ----
        split.chars.forEach((char, index) => {
            if (char.textContent === " ") return;

            const wrapper = document.createElement("div");
            wrapper.style.display = "inline-block";
            wrapper.style.position = "relative";
            wrapper.style.overflow = "visible";
            wrapper.style.height = "3em";
            wrapper.style.marginTop = "1rem";
            wrapper.style.marginLeft = "-0.5rem";
            wrapper.style.marginRight = "-0.5rem";
            wrapper.style.verticalAlign = "middle";
            char.parentNode?.replaceChild(wrapper, char);
            wrapper.appendChild(char);

            // Duplicate letters
            [-1, 1].forEach(offset => {
                const dup = char.cloneNode(true) as HTMLElement;
                dup.style.position = "absolute";
                dup.style.left = "0";
                dup.style.top = "0";
                dup.style.transform = `translateY(${offset * 80}%)`;
                wrapper.appendChild(dup);
            });

            // Entry animation
            const pos = 100 + Math.random() * 400;
            const neg = -(100 + Math.random() * 400);
            const initialY = Math.random() < 0.5 ? pos : neg;

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
                            yPercent: -30,
                            ease: "none",
                            scrollTrigger: {
                                trigger: container,
                                start: "top",
                                end: "bottom",
                                scrub: 1,
                            },
                        });
                    },
                }
            );
        });

        // ---- SINGLE SCROLL SCALE ANIMATION ----
        gsap.fromTo(
            container,
            { scale: 1 },
            {
                scale: 2.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top +=100px",
                    end: "bottom",
                    scrub: 1,
                },
            }
        );

        ScrollTrigger.refresh();
    }, [title]);

    return (
        <div className="flex justify-center items-center mt-40 n">
            <div
                ref={containerRef}
                className="flex flex-wrap justify-center items-center text-[18rem] overflow-hidden max-h-[1.1em]"
            />
        </div>
    );
};

export default Title;
