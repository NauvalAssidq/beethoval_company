"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Pencil, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/features/projects/DeleteDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { type Faq } from "@/types/faq";

function SortableFaqItem({ 
  faq, 
  onEdit, 
  onDelete 
}: { 
  faq: Faq; 
  onEdit: (id: string) => void; 
  onDelete: (faq: Faq) => void; 
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: faq._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800 group"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-2 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900"
      >
        <GripVertical className="size-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
          {faq.question}
        </h4>
        <p className="text-sm text-zinc-500 truncate mt-1">
          {faq.answer}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(faq._id)}
          className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
        >
          <Pencil className="size-4" />
        </button>
        <button 
          onClick={() => onDelete(faq)}
          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function FaqIndex() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs);
      }
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setFaqs((items) => {
        const oldIndex = items.findIndex(i => i._id === active.id);
        const newIndex = items.findIndex(i => i._id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        const updated = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
        
        fetch("/api/faqs/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updated.map(i => ({ id: i._id, order: i.order })) })
        }).catch(() => toast.error("Failed to save FAQ order"));
        
        return updated;
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/faqs/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete FAQ");
      toast.success("FAQ deleted successfully");
      setFaqs(faqs.filter(f => f._id !== deleteTarget._id));
    } catch (err) {
      toast.error("Failed to delete FAQ");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">FAQs</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage frequently asked questions. Drag to reorder.
          </p>
        </div>
        <Link
          href="/dashboard/faqs/create"
          className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus className="size-4" />
          Add FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800">
          <HelpCircle className="size-10 text-zinc-300 dark:text-zinc-700" />
          <p className="text-zinc-500">
            No FAQs yet
          </p>
          <Link
            href="/dashboard/faqs/create"
            className="inline-flex items-center justify-center rounded-full px-5 gap-2 h-9 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-200 mt-2 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <Plus className="size-4" />
            <span>Create your first FAQ</span>
          </Link>
        </div>
      ) : !mounted ? null : (
        <div className="max-w-3xl">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={faqs.map(f => f._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {faqs.map((faq) => (
                  <SortableFaqItem 
                    key={faq._id} 
                    faq={faq} 
                    onEdit={(id) => router.push(`/dashboard/faqs/${id}/edit`)}
                    onDelete={(faq) => setDeleteTarget(faq)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      <DeleteDialog
        open={!!deleteTarget}
        title="this FAQ"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
