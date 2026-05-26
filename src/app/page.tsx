"use client";
import { useState, useEffect } from "react";
import { Hero } from "@/components/features/landing/Hero";
import { Projects } from "@/components/features/landing/Projects";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className="flex min-h-screen flex-col">
            <Navbar isScrolled={isScrolled} />
            <div id="home">
                <Hero />
            </div>
            <Projects />
        </main>
    );
}