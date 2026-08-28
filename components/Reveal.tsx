"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals its contents once they scroll into view.
 *
 * One observer per group rather than one per item: the children stagger
 * themselves with CSS transition delays, so a four-column strip costs a
 * single observer and no per-item state.
 *
 * The attribute is flipped on the node directly rather than held in state.
 * Nothing React renders depends on it, only CSS does, so a re-render would
 * buy nothing and the effect is doing what an effect is for: syncing the DOM
 * with an outside event.
 *
 * The hidden state is server-rendered, which means a reader with JavaScript
 * off would be left looking at nothing. The `<noscript>` block in the root
 * layout cancels the rule for them, and any browser without
 * IntersectionObserver is shown everything immediately.
 */
export default function Reveal({
  children,
  className,
  /** Fires slightly before the element is fully on screen. */
  margin = "0px 0px -12% 0px",
}: {
  children: React.ReactNode;
  className?: string;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => {
      node.dataset.reveal = "in";
    };

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <div ref={ref} data-reveal="out" className={className}>
      {children}
    </div>
  );
}
