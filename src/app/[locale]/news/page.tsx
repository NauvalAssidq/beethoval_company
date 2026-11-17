import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { resolveTranslation } from "@/types/i18n";
import { getCachedFooter } from "@/lib/landing-data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "Berita & Artikel | Beethoval.dev" : "News & Journal | Beethoval.dev",
    description: isId
      ? "Pelajari wawasan, pembaruan, dan artikel terbaru dari Beethoval."
      : "Explore the latest insights, updates, and articles from Beethoval.",
  };
}

async function getAllNews() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const news = await db
      .collection("news")
      .find({}, { projection: { title: 1, slug: 1, excerpt: 1, coverImage: 1, tags: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    return news.map((n) => ({
      _id: n._id.toString(),
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt || "",
      coverImage: n.coverImage || "",
      tags: Array.isArray(n.tags) ? n.tags : [],
      createdAt: n.createdAt?.toISOString?.() ?? String(n.createdAt ?? ""),
    }));
  } catch (err) {
    console.error("Error loading news in /news page:", err);
    return [];
  }
}

export default async function LocalizedAllNewsPage({ params }: PageProps) {
  const { locale } = await params;
  const [news, footerData] = await Promise.all([
    getAllNews(),
    getCachedFooter(),
  ]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isId = locale === "id";

  return (
    <main className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar />

      <section className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-gray-200">
        <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-indigo-600" />
            <p className="text-[11px] font-semibold text-indigo-600 tracking-[0.2em] uppercase font-mono">
              {isId ? "Jurnal & Wawasan" : "Journal & Insights"}
            </p>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 tracking-tight leading-[1.05]">
            {isId ? "Semua Berita & Artikel" : "All Articles & News"}
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mt-4">
            {isId
              ? "Pemikiran, retrospeksi teknis, filosofi desain, dan pembaruan platform."
              : "Thoughts, technical retrospectives, design philosophies, and platform updates."}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 flex-1">
        <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          {news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl text-gray-200 font-serif italic mb-6 select-none">
                N
              </span>
              <h2 className="font-serif text-2xl text-gray-900 mb-2">
                {isId ? "Belum ada berita" : "No news yet"}
              </h2>
              <p className="text-[14px] text-gray-400 font-medium max-w-sm">
                {isId
                  ? "Kembali lagi nanti untuk pembaruan dan artikel baru."
                  : "Check back soon for new articles and insights."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {news.map((item) => {
                const title = resolveTranslation(item.title as any, locale);
                const slug = resolveTranslation(item.slug as any, locale);
                const excerpt = resolveTranslation(item.excerpt as any, locale);

                return (
                  <Link
                    key={item._id}
                    href={`/news/${slug}`}
                    className="group flex flex-col transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-6 border border-gray-200">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={title}
                          className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center">
                          <span className="text-indigo-200 font-serif italic text-6xl select-none">
                            {title[0] || "N"}
                          </span>
                        </div>
                      )}

                      <div className="absolute top-4 right-4 size-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-md">
                        <ArrowUpRight className="size-4 text-gray-900" />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      {item.createdAt && (
                        <span className="text-[11px] font-semibold text-gray-400 mb-3 tracking-widest uppercase block">
                          {formatDate(item.createdAt)}
                        </span>
                      )}
                      <h2 className="font-serif text-2xl lg:text-3xl text-gray-900 leading-[1.2] mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {title}
                      </h2>
                      {excerpt && (
                        <p className="text-[14px] text-gray-500 leading-relaxed font-medium line-clamp-3">
                          {excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer footerData={footerData} />
    </main>
  );
}
