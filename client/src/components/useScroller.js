import { useEffect, useRef } from "react";

export default function useScroller(fn) {
  const cb = useRef(fn);

  useEffect(() => (cb.current = fn));

  useEffect(() => {
    function curr(e) {
      cb.current(e);
    }
    window.addEventListener("scroll", curr);
    return () => window.removeEventListener("scroll", curr);
  }, []);
}
