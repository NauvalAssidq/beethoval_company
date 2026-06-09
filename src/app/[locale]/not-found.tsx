import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-[#fafafa]">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-20">
        <span className="text-8xl md:text-9xl text-gray-200 font-serif italic mb-6 select-none">404</span>
        <h1 className="text-4xl md:text-6xl text-gray-900 tracking-tight leading-[1.05] mb-4">
          <span className="font-sans font-regular">Page</span> <span className="font-serif italic text-indigo-600">Not Found</span>
        </h1>
        <p className="text-[14px] text-gray-500 font-medium max-w-md mb-10 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-3 h-12 md:h-14 px-8 md:px-10 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <span>Return Home</span>
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <Footer />
    </main>
  );
}
