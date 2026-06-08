import {
  getCachedMarqueeItems,
  getCachedProjectCards,
  getCachedServices,
  getCachedNews,
  getCachedFooter,
  getCachedHero,
} from "@/lib/landing-data";
import { Hero } from "@/components/features/landing/Hero";
import { Projects } from "@/components/features/landing/Projects";
import { About } from "@/components/features/landing/About";
import { News } from "@/components/features/landing/News";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Services } from "@/components/features/landing/Services";

export default async function Home() {
  const [marqueeItems, projectCards, services, news, footerData, heroData] =
    await Promise.all([
      getCachedMarqueeItems(),
      getCachedProjectCards(),
      getCachedServices(),
      getCachedNews(),
      getCachedFooter(),
      getCachedHero(),
    ]);

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div id="home">
        <Hero marqueeItems={marqueeItems} heroData={heroData} />
      </div>
      <About />
      <Projects initialProjects={projectCards} />
      <Services initialServices={services} />
      <News initialNews={news} />
      <Footer footerData={footerData} />
    </main>
  );
}