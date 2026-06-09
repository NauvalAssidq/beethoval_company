import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Metadata } from "next";
import clientPromise from "@/lib/mongodb";
import { Link } from "@/i18n/routing";
import { ChevronDown, BarChart3, FolderKanban, FileText, Images, HelpCircle } from "lucide-react";
import { VisitorChart } from "@/components/features/dashboard/VisitorChart";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { resolveTranslation } from "@/types/i18n";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  const t = await getTranslations("DashboardPage");

  const client = await clientPromise;
  const db = client.db("portfolio");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [projectCount, newsCount, faqCount, galleryCount, totalVisits, visitsDataRaw, recentProjects, recentNews, recentGalleries] = await Promise.all([
    db.collection("projects").countDocuments(),
    db.collection("news").countDocuments(),
    db.collection("faqs").countDocuments(),
    db.collection("galleries").countDocuments(),
    db.collection("visits").countDocuments(),
    db.collection("visits").aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray(),
    db.collection("projects").find({}, { projection: { title: 1, coverImage: 1, createdAt: 1, _id: 1 } }).sort({ createdAt: -1 }).limit(4).toArray(),
    db.collection("news").find({}, { projection: { title: 1, coverImage: 1, createdAt: 1, _id: 1 } }).sort({ createdAt: -1 }).limit(4).toArray(),
    db.collection("galleries").find({}, { projection: { url: 1 } }).sort({ createdAt: -1 }).limit(12).toArray(),
  ]);

  const chartData = [];
  for (let i = 0; i <= 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const match = visitsDataRaw.find((v: any) => v._id === dateStr);
    
    const month = d.toLocaleString('default', { month: 'short' });
    const day = d.getDate();
    
    chartData.push({
      date: `${month} ${day}`,
      fullDate: `${month} ${day}, ${d.getFullYear()}`,
      visitors: match ? match.count : 0
    });
  }

  const formatDate = (date: any) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };



  return (
    <div className="flex flex-col gap-6 pb-12 w-full">
      
      <div className="flex flex-wrap items-center gap-3 w-full">
        <div className="backdrop-blur-md bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3">
          <FolderKanban className="size-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{t('projects')}</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-white">{projectCount}</span>
        </div>
        <div className="backdrop-blur-md bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3">
          <FileText className="size-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{t('articles')}</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-white">{newsCount}</span>
        </div>
        <div className="backdrop-blur-md bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3">
          <Images className="size-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{t('gallery')}</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-white">{galleryCount}</span>
        </div>
        <div className="backdrop-blur-md bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3">
          <HelpCircle className="size-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{t('faqs')}</span>
          <span className="text-sm font-bold text-zinc-900 dark:text-white">{faqCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="col-span-1 md:col-span-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex flex-col relative">
          <div className="p-6 pb-0 flex items-center justify-between z-10 relative">
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                <BarChart3 className="size-3" />
                {t('visitor_analytics')}
              </span>
              <span className="font-serif text-5xl text-zinc-900 dark:text-white mt-2 tracking-tighter">{totalVisits.toLocaleString()}</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">{t('live_data_tracking')}</span>
            </div>
            
            <div className="relative group cursor-pointer">
              <select className="appearance-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Year to Date</option>
              </select>
              <ChevronDown className="size-3 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 w-full relative min-h-[220px] mt-4 z-0 px-2">
            <VisitorChart data={chartData} />
          </div>
        </div>

        <div className="col-span-1 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
          <div className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">{t('recent_projects')}</span>
            <Link href="/dashboard/projects" className="text-[10px] text-indigo-600 hover:underline font-bold uppercase">{t('view_all')}</Link>
          </div>
          <div className="flex flex-col w-full flex-1">
            {recentProjects.map((project, i) => (
              <Link 
                key={`p-${project._id}`} 
                href={`/dashboard/projects/${project._id}/edit`}
                className="group relative flex flex-col justify-center border-b border-zinc-100 dark:border-zinc-900 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] h-16 hover:h-40 overflow-hidden cursor-pointer last:border-b-0"
              >
                {project.coverImage && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105 group-hover:scale-100 z-0"
                      style={{ backgroundImage: `url(${project.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-white/90 dark:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </>
                )}
                
                <div className="relative z-20 px-6 flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {resolveTranslation(project.title as any, locale)}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1 opacity-0 group-hover:opacity-100 absolute group-hover:relative transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      {t('added')} {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {recentProjects.length === 0 && <div className="p-6 text-sm text-zinc-500 text-center">{t('no_projects_found')}</div>}
          </div>
        </div>

        <div className="col-span-1 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
          <div className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">{t('recent_articles')}</span>
            <Link href="/dashboard/news" className="text-[10px] text-indigo-600 hover:underline font-bold uppercase">{t('view_all')}</Link>
          </div>
          <div className="flex flex-col w-full flex-1">
            {recentNews.map((news, i) => (
              <Link 
                key={`n-${news._id}`} 
                href={`/dashboard/news/${news._id}/edit`}
                className="group relative flex flex-col justify-center border-b border-zinc-100 dark:border-zinc-900 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] h-16 hover:h-40 overflow-hidden cursor-pointer last:border-b-0"
              >
                {news.coverImage && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105 group-hover:scale-100 z-0"
                      style={{ backgroundImage: `url(${news.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-white/90 dark:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </>
                )}
                
                <div className="relative z-20 px-6 flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {resolveTranslation(news.title as any, locale)}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1 opacity-0 group-hover:opacity-100 absolute group-hover:relative transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      {t('published')} {formatDate(news.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {recentNews.length === 0 && <div className="p-6 text-sm text-zinc-500 text-center">{t('no_articles_found')}</div>}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <Images className="size-3" />
              {t('gallery_overview')}
            </span>
            <Link href="/dashboard/gallery" className="text-[10px] text-indigo-600 hover:underline font-bold uppercase">{t('manage_gallery')}</Link>
          </div>
          
          {recentGalleries.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recentGalleries.map((img, i) => (
                <Link href="/dashboard/gallery" key={`g-${img._id}`} className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <Image 
                    src={img.url} 
                    alt="Gallery image" 
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full py-12 flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
              <Images className="size-8 text-zinc-300 dark:text-zinc-700 mb-3" />
              <p className="text-sm text-zinc-500">{t('no_images_in_gallery')}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}