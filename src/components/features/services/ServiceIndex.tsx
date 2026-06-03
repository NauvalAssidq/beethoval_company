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
  rectSortingStrategy, 
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, Pencil, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/features/projects/DeleteDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { type Service } from "@/types/service";

function SortableServiceItem({ 
  service, 
  onEdit, 
  onDelete 
}: { 
  service: Service; 
  onEdit: (id: string) => void; 
  onDelete: (service: Service) => void; 
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group relative flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-2 left-2 z-10 p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-lg cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="size-4" />
      </div>

      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(service._id)}
          className="p-2 text-white/70 hover:text-white bg-black/40 hover:bg-indigo-600 backdrop-blur-sm rounded-lg transition-colors"
        >
          <Pencil className="size-4" />
        </button>
        <button 
          onClick={() => onDelete(service)}
          className="p-2 text-white/70 hover:text-white bg-black/40 hover:bg-red-600 backdrop-blur-sm rounded-lg transition-colors"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="aspect-video w-full relative bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        {service.image ? (
          <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-zinc-300 dark:text-zinc-700">
            <Layers className="size-8" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1">
          {service.title}
        </h4>
        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
          {service.description}
        </p>
        
        {service.languages && service.languages.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {service.languages.slice(0, 3).map(lang => (
              <span key={lang} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono truncate max-w-[80px]">
                {lang}
              </span>
            ))}
            {service.languages.length > 3 && (
              <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono">
                +{service.languages.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ServiceIndex() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services);
      }
    } catch (err) {
      toast.error("Failed to load Services");
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
      setServices((items) => {
        const oldIndex = items.findIndex(i => i._id === active.id);
        const newIndex = items.findIndex(i => i._id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        const updated = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
        
        fetch("/api/services/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updated.map(i => ({ id: i._id, order: i.order })) })
        }).catch(() => toast.error("Failed to save Service order"));
        
        return updated;
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/services/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete Service");
      toast.success("Service deleted successfully");
      setServices(services.filter(s => s._id !== deleteTarget._id));
    } catch (err) {
      toast.error("Failed to delete Service");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <Skeleton className="w-full aspect-video rounded-none" />
              <div className="p-4 flex flex-col flex-1">
                <Skeleton className="h-5 w-3/4 mb-2 rounded-md" />
                <Skeleton className="h-3 w-full mb-1.5 rounded-sm" />
                <Skeleton className="h-3 w-5/6 mb-4 rounded-sm" />
                <div className="flex flex-wrap gap-1 mt-auto">
                  <Skeleton className="h-4 w-12 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-14 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100 tracking-tight">Services</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage the services you offer. Drag to reorder them.
          </p>
        </div>
        <Link
          href="/dashboard/services/create"
          className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 border border-zinc-200 rounded-xl bg-white dark:bg-zinc-950 dark:border-zinc-800">
          <Layers className="size-10 text-zinc-300 dark:text-zinc-700" />
          <p className="text-zinc-500">
            No Services yet
          </p>
          <Link
            href="/dashboard/services/create"
            className="inline-flex items-center justify-center rounded-full px-5 gap-2 h-9 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-200 mt-2 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <Plus className="size-4" />
            <span>Create your first Service</span>
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-7xl">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={services.map(s => s._id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <SortableServiceItem 
                    key={service._id} 
                    service={service} 
                    onEdit={(id) => router.push(`/dashboard/services/${id}/edit`)}
                    onDelete={(service) => setDeleteTarget(service)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      <DeleteDialog
        open={!!deleteTarget}
        title="this Service"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
