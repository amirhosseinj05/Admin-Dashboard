import { useEffect } from 'react';

/**
 * Calls `handler` when a click happens outside `ref` (used to close the
 * topbar dropdowns). Also closes on Escape for basic keyboard accessibility.
 */
export default function useClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return undefined;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    const keyListener = (event) => {
      if (event.key === 'Escape') handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('keydown', keyListener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('keydown', keyListener);
    };
  }, [ref, handler, active]);
}
