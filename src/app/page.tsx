import { Metadata } from "next";
import { Hero } from "@/components/features/landing/Hero";
import { Projects } from "@/components/features/landing/Projects";
import { About } from "@/components/features/landing/About";
import { News } from "@/components/features/landing/News";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Services } from "@/components/features/landing/Services";

export const metadata: Metadata = {
  title: "Beethoval Developer | Landing Page",
  description: "Portfolio of Beethoval Developer, company that helps you with tech.",
};

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            <div id="home">
                <Hero />
            </div>
            <About />
            <Projects />
            <Services />
            <News />
            <Footer/>
        </main>
    );
}