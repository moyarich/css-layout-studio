import { useRef, useCallback, useEffect, useMemo } from "react";

export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 150,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<number | null>(null);
  const argsRef = useRef<TArgs | null>(null);

  callbackRef.current = callback;

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) {
      return;
    }

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const runPending = useCallback(() => {
    const args = argsRef.current;

    timerRef.current = null;
    argsRef.current = null;

    if (args !== null) {
      callbackRef.current(...args);
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();

    if (argsRef.current === null) {
      return;
    }

    timerRef.current = window.setTimeout(runPending, delay);
  }, [clearTimer, delay, runPending]);

  const cancel = useCallback(() => {
    clearTimer();
    argsRef.current = null;
    console.log("->===debounce cancelled");
  }, [clearTimer]);

  const flush = useCallback(() => {
    clearTimer();
    runPending();
    console.log("->===debounce flush");
  }, [clearTimer, runPending]);

  const reset = useCallback(() => {
    startTimer();
    console.log("->===debounce reset");
  }, [startTimer]);

  const debounced = useCallback(
    (...args: TArgs) => {
      argsRef.current = args;

      startTimer();
    },
    [startTimer],
  );

  useEffect(() => cancel, [cancel]);

  return useMemo(
    () =>
      Object.assign(debounced, {
        cancel,
        flush,
        reset,
      }),
    [cancel, debounced, flush, reset],
  );
}
