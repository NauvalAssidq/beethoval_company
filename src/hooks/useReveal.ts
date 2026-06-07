import { useEffect, useRef, useState } from "react";

const observerMap = new Map<number, IntersectionObserver>();
const callbacks = new WeakMap<Element, () => void>();

function getObserver(threshold: number) {
  if (typeof window === "undefined") return null;
  if (!observerMap.has(threshold)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target);
            if (cb) {
              cb();
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold }
    );
    observerMap.set(threshold, observer);
  }
  return observerMap.get(threshold)!;
}

export function useReveal(threshold = 0.15) {
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    callbacks.set(el, () => setVisible(true));
    const observer = getObserver(threshold);
    if (observer) observer.observe(el);

    return () => {
      if (observer && el) observer.unobserve(el);
      callbacks.delete(el);
    };
  }, [threshold]);

  return { ref, visible };
}
