import { useCallback, useEffect, useRef, useState } from "react";

export interface UseScrollElementProps {
  bottom: boolean;
}

const useScrollElement = <S extends HTMLElement, I extends HTMLElement>({
  bottom,
}: UseScrollElementProps) => {
  const scrollRef = useRef<S | null>(null);
  const innerRef = useRef<I | null>(null);

  const [history, setHistory] = useState<{ height: number; scroll: number }>({
    height: 0,
    scroll: 0,
  });

  const handleResize: ResizeObserverCallback = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    if (bottom) {
      element.scrollTo({ top: element.scrollHeight - element.clientHeight });
    } else {
      const { scroll, height } = history;
      element.scrollTo({ top: scroll + element.scrollHeight - height });
    }
  }, [bottom, scrollRef, history]);

  useEffect(() => {
    if (innerRef.current) {
      const observer = new ResizeObserver(handleResize);
      observer.observe(innerRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [innerRef, handleResize]);

  return { scrollRef, innerRef, history, setHistory };
};

export default useScrollElement;
