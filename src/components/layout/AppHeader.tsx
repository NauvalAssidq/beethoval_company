import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="relative sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-[#fafafa]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="flex items-center gap-2 z-10">
        <SidebarTrigger className="-ml-1 hover:text-indigo-600 transition-colors" />
        <span className="font-serif text-lg text-gray-900 dark:text-gray-100">Beethoval.dev</span>
      </div>
    </header>
  );
}