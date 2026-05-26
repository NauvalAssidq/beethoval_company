"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  type: "project" | "gallery";
  url: string;
  order: number;
}

function SortableItem({ item, onDelete }: { item: GalleryItem, onDelete: (id: string, type: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative group rounded-[10px] overflow-hidden border border-gray-200 bg-white aspect-[4/3] shadow-none flex flex-col"
    >
      <div {...attributes} {...listeners} className="flex-1 w-full relative cursor-grab active:cursor-grabbing">
        <img src={item.url} className="w-full h-full object-cover" alt="Gallery item" />
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-medium rounded-md uppercase tracking-wider backdrop-blur-sm">
          {item.type}
        </div>
      </div>
      {item.type === "gallery" && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(item.id, item.type); }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-sm"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/public/projects")
      .then(r => r.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load marquee images");
        setLoading(false);
      });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        const updated = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
        
        fetch("/api/marquee/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updated })
        }).catch(() => toast.error("Failed to save order"));
        
        return updated;
      });
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if(type !== "gallery") return;
    
    const previousItems = [...items];
    setItems(items.filter(i => i.id !== id));
    
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Image removed from marquee");
    } catch (err) {
      setItems(previousItems);
      toast.error("Failed to delete image");
    }
  };

  const handleUpload = async (url: string) => {
    setUploading(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      if (!res.ok) throw new Error("Failed to upload");
      
      const data = await res.json();
      setItems([...items, { id: data.id, type: "gallery", url, order: items.length + 1 }]);
      toast.success("Image added to marquee");
    } catch (err) {
      toast.error("Failed to add image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-none">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-3 w-48 mt-4" />
              <Skeleton className="h-3 w-32 mt-2" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="p-6 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-none">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-[10px] w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100 tracking-tight">Marquee Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and reorder images for your homepage marquee. Drag to reorder.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-none">
            <h2 className="text-[16px] font-serif font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <ImageIcon className="size-4 text-indigo-500" />
              Add Custom Image
            </h2>
            <div className="opacity-90">
                <ImageUploader 
                  value=""
                  onChange={handleUpload}
                  disabled={uploading}
                />
            </div>
            <p className="text-[12px] text-gray-400 mt-3 leading-relaxed">
              Custom uploads will be mixed with your existing Project marquee images.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800 text-gray-400">
              <ImageIcon className="size-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">No images in marquee</p>
            </div>
          ) : (
            <div className="p-6 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-none">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={items.map(i => i.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <SortableItem key={item.id} item={item} onDelete={handleDelete} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
