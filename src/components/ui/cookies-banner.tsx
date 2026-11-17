"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"
import { useTranslations } from "next-intl"

export function CookiesBanner() {
  const t = useTranslations("CookiesBanner")
  const [hasAccepted, setHasAccepted] = useState(true)

  useEffect(() => {
    const isAccepted = localStorage.getItem("cookies-accepted")
    if (!isAccepted) {
      const timer = setTimeout(() => setHasAccepted(false), 0)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = async () => {
    localStorage.setItem("cookies-accepted", "true")
    setHasAccepted(true)
    
    try {
      await fetch("/api/public/visits", { method: "POST" })
    } catch (error) {
    }
  }

  if (hasAccepted) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[420px] animate-fade-up">
      <div className="flex flex-col gap-5 rounded-none border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <h3 className="text-2xl text-gray-900 dark:text-white leading-none tracking-tight">
              <span className="font-sans">
                {t("title_primary")}{" "}
              </span>
              <span className="font-serif italic text-indigo-600">
                {t("title_accent")}
              </span>
            </h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-sans font-medium">
              {t("description")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="outline" 
            className="flex-1 rounded-none font-sans text-[13px] font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
            onClick={() => setHasAccepted(true)}
          >
            {t("decline")}
          </Button>
          <Button 
            className="flex-1 rounded-none font-sans text-[13px] font-medium bg-gray-800 hover:bg-gray-800 hover:shadow-gray-900/20 text-white" 
            onClick={handleAccept}
          >
            {t("accept_all")}
          </Button>
        </div>
      </div>
    </div>
  )
}
