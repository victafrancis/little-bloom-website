import { useEffect, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';

const RETRY_DELAY_MS = 1500;
const MAX_RETRIES = 1;

// Report each broken photo once per visit, so one bad file can't flood Sentry
const reportedSources = new Set<string>();

const withRetryParam = (src: string, attempt: number): string => {
  if (attempt === 0) {
    return src;
  }
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}retry=${attempt}`;
};

const reportBrokenImage = (src: string, context: string) => {
  // Offline visitors can't load anything, which isn't a broken photo
  if (!navigator.onLine || reportedSources.has(src)) {
    return;
  }
  reportedSources.add(src);
  Sentry.captureMessage('Image failed to load after retrying', {
    level: 'warning',
    tags: { operation: 'image_load', image_context: context },
    extra: { src }
  });
};

type ImageRetryState = {
  forSrc: string;
  attempt: number;
  hasFailed: boolean;
};

// Retries a failed photo once with a cache-busting param, since dropped mobile connections usually recover
export const useImageRetry = (src: string, context: string) => {
  const [state, setState] = useState<ImageRetryState>({ forSrc: src, attempt: 0, hasFailed: false });
  const retryTimerRef = useRef(0);

  // Start over when the image changes, e.g. the next photo in the lightbox
  if (state.forSrc !== src) {
    setState({ forSrc: src, attempt: 0, hasFailed: false });
  }

  useEffect(() => () => window.clearTimeout(retryTimerRef.current), []);

  const handleError = () => {
    if (state.attempt >= MAX_RETRIES) {
      setState(prev => (prev.forSrc === src ? { ...prev, hasFailed: true } : prev));
      reportBrokenImage(src, context);
      return;
    }
    window.clearTimeout(retryTimerRef.current);
    retryTimerRef.current = window.setTimeout(() => {
      setState(prev => (prev.forSrc === src ? { ...prev, attempt: prev.attempt + 1 } : prev));
    }, RETRY_DELAY_MS);
  };

  return {
    src: withRetryParam(src, state.forSrc === src ? state.attempt : 0),
    hasFailed: state.forSrc === src && state.hasFailed,
    handleError
  };
};
