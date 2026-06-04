
import { Hero } from "@/components/features/landing/Hero";
import { Projects } from "@/components/features/landing/Projects";
import { About } from "@/components/features/landing/About";
import { News } from "@/components/features/landing/News";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Services } from "@/components/features/landing/Services";



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