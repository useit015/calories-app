import { useCallback, useLayoutEffect, useState } from 'react';
import { useEventListener } from './useEventListener';

interface Size {
  width: number;
  height: number;
}

export const useElementSize = <T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size,
] => {
  const [ref, setRef] = useState<T | null>(null);

  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const handleSize = useCallback(() => {
    setSize({
      width: ref?.offsetWidth || 0,
      height: ref?.offsetHeight || 0,
    });
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  useEventListener('resize', handleSize);

  useLayoutEffect(() => {
    handleSize();
  }, [ref?.offsetHeight, ref?.offsetWidth, handleSize]);

  return [setRef, size];
};
