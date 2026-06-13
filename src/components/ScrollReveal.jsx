import { useEffect, useRef } from 'react';

/**
 * ScrollReveal — wraps children in a div that fades/slides up
 * when it enters the viewport.
 *
 * Props:
 *   delay  — CSS transition-delay in ms (default 0)
 *   y      — translateY start offset in px (default 30)
 *   className — extra classes to pass through
 */
export default function ScrollReveal({ children, delay = 0, y = 30, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;
    el.style.transition = `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
