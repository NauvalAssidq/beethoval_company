"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function Footer() {
  const [footerData, setFooterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const footerRef = useRef<HTMLElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(false);

  useEffect(() => {
    async function fetchFooter() {
      try {
        const res = await fetch("/api/public/footer");
        if (res.ok) {
          const data = await res.json();
          setFooterData(data);
        }
      } catch (err) {
        console.error("Failed to load footer data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFooter();
  }, []);

  useEffect(() => {
    if (loading || !footerData) return;

    const headingEl = footerRef.current?.querySelector('[data-footer="heading"]');
    const gridEl = footerRef.current?.querySelector('[data-footer="grid"]');
    const bottomEl = footerRef.current?.querySelector('[data-footer="bottom"]');

    const observers: IntersectionObserver[] = [];

    if (headingEl) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setHeadingVisible(true); obs.unobserve(entry.target); } },
        { threshold: 0.2 }
      );
      obs.observe(headingEl);
      observers.push(obs);
    }

    if (gridEl) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setGridVisible(true); obs.unobserve(entry.target); } },
        { threshold: 0.1 }
      );
      obs.observe(gridEl);
      observers.push(obs);
    }

    if (bottomEl) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setBottomVisible(true); obs.unobserve(entry.target); } },
        { threshold: 0.5 }
      );
      obs.observe(bottomEl);
      observers.push(obs);
    }

    return () => { observers.forEach((obs) => obs.disconnect()); };
  }, [loading, footerData]);

  if (loading) {
    return (
      <footer className="w-full bg-white border-t border-gray-200">
        <div className="w-full border-b border-gray-200 px-6 py-24 md:py-32 flex flex-col items-center justify-center bg-[#fafafa]">
          <Skeleton className="h-16 md:h-24 lg:h-32 w-3/4 max-w-4xl" />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-b border-gray-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 sm:p-10 md:col-span-1 min-h-[250px]">
              <Skeleton className="h-3 w-16 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full px-6 sm:px-10 py-6 flex flex-col md:flex-row justify-between items-center">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32 mt-2 md:mt-0" />
        </div>
      </footer>
    );
  }

  if (!footerData) return null;

  const allColumns = [
    { type: "contact" as const },
    ...(footerData.links || []).map((g: any) => ({ type: "links" as const, data: g })),
    { type: "socials" as const },
  ];

  return (
    <footer ref={footerRef} className="w-full bg-white text-gray-900 border-t border-gray-200 font-sans">

      <div
        data-footer="heading"
        className={cn(
          "w-full border-b border-gray-200 px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center bg-[#fafafa] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-regular uppercase tracking-tighter leading-none">
          {footerData.heading?.primary}{' '}
          <span className="font-serif italic font-normal normal-case tracking-normal text-indigo-600">
            {footerData.heading?.secondary}
          </span>
        </h2>
      </div>

      <div
        data-footer="grid"
        className="w-full grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-b border-gray-200"
      >
        {allColumns.map((col, colIdx) => (
          <div
            key={colIdx}
            className={cn(
              "p-6 sm:p-10 md:col-span-1 min-h-[250px] transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              col.type === "contact" && "flex flex-col justify-between",
              gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: gridVisible ? `${colIdx * 150}ms` : "0ms" }}
          >
            {col.type === "contact" && (
              <div>
                <h3 className="text-[11px] uppercase font-bold mb-6 tracking-widest text-gray-500">Contact</h3>
                <a href={`mailto:${footerData.contact?.email}`} className="block text-xl md:text-2xl font-medium mb-3 hover:font-serif hover:italic hover:text-indigo-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  {footerData.contact?.email}
                </a>
                <a href={`tel:${footerData.contact?.phone?.replace(/\s+/g, '')}`} className="block text-xl md:text-2xl font-medium hover:font-serif hover:italic hover:text-indigo-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  {footerData.contact?.phone}
                </a>
              </div>
            )}

            {col.type === "links" && (
              <>
                <h3 className="text-[11px] uppercase font-bold mb-6 tracking-widest text-gray-500">{col.data.title}</h3>
                <ul className="space-y-4">
                  {col.data.items?.map((item: any, itemIdx: number) => (
                    <li key={itemIdx}>
                      <Link href={item.href} className="text-lg font-medium hover:italic hover:font-serif hover:text-indigo-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {col.type === "socials" && (
              <>
                <h3 className="text-[11px] uppercase font-bold mb-6 tracking-widest text-gray-500">Socials</h3>
                <ul className="space-y-4">
                  {footerData.socials?.map((social: any, idx: number) => (
                    <li key={idx}>
                      <a href={social.href} target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:italic hover:font-serif hover:text-indigo-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>

      <div
        data-footer="bottom"
        className={cn(
          "w-full px-6 sm:px-10 py-6 flex flex-col md:flex-row justify-between items-center text-[12px] font-medium uppercase tracking-wider text-gray-400 transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] delay-200",
          bottomVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <p>{footerData.copyright}</p>
        <p className="mt-2 md:mt-0 font-serif italic normal-case tracking-normal text-[15px] text-gray-500">Designed with intent.</p>
      </div>
    </footer>
  );
}
