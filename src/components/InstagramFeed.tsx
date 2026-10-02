import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ClapperboardIcon, CopyIcon, InstagramIcon } from 'lucide-react';
import { site } from '../data/siteMeta';
import { getInstagramFeed, InstagramFeedData, InstagramPost } from '../lib/instagram';

// The same camera-and-flower mark as the Instagram profile picture
const AVATAR_SRC = '/assets/Green%20and%20White%20Minimalist%20Botanical%20Logo.png';
const AUTOPLAY_INTERVAL_MS = 3500;
const SCROLL_SETTLE_MS = 150;
// Fewer posts than this would repeat side by side on wide screens, so they don't loop
const MIN_LOOPING_POSTS = 8;
const LOOP_COPIES = 3;
const SKELETON_TILES = 8;
const TILE_CLASS_NAME = 'w-[44%] sm:w-[30%] md:w-[23%] lg:w-[18%] xl:w-[15%] shrink-0 snap-center aspect-square rounded-lg';
const TRACK_CLASS_NAME = 'flex gap-3 md:gap-4';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type FeedTileProps = {
  post: InstagramPost;
  isClone: boolean;
  isFromInstagram: boolean;
};

function FeedTile({ post, isClone, isFromInstagram }: FeedTileProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const BadgeIcon = post.type === 'carousel' ? CopyIcon : post.type === 'video' ? ClapperboardIcon : null;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={isClone ? -1 : undefined}
      aria-hidden={isClone || undefined}
      className={`group relative isolate block overflow-hidden bg-cream focus:outline-none ${TILE_CLASS_NAME}`}
    >
      {!isLoaded && <InstagramIcon aria-hidden="true" className="absolute inset-0 m-auto h-8 w-8 text-mauve/40" />}
      {!hasError && (
        <img
          src={post.imageUrl}
          alt={post.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`relative h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {BadgeIcon && (
        <BadgeIcon aria-hidden="true" className="absolute right-2 top-2 h-4 w-4 md:h-5 md:w-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
      )}
      <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-text/0 transition-colors duration-300 group-hover:bg-text/30 group-focus-visible:bg-text/30 group-focus-visible:ring-4 group-focus-visible:ring-inset group-focus-visible:ring-sage">
        <InstagramIcon aria-hidden="true" className="h-7 w-7 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      </span>
      <span className="sr-only">{isFromInstagram ? ' (view on Instagram)' : ' (visit Instagram)'}</span>
    </a>
  );
}

function FeedSkeleton() {
  return (
    <div className={`${TRACK_CLASS_NAME} justify-center overflow-hidden`} aria-hidden="true">
      {Array.from({ length: SKELETON_TILES }, (_, index) => (
        <div key={index} className={`${TILE_CLASS_NAME} bg-cream animate-pulse`} />
      ))}
    </div>
  );
}

/**
 * A swipeable strip of square posts. With enough posts it loops endlessly:
 * the posts are rendered three times and the scroll position quietly jumps
 * back to the middle copy whenever it settles near either end. It glides one
 * post at a time until the visitor takes over (swipe, wheel or arrows), and
 * pauses on hover, on keyboard focus, offscreen, and for reduced motion.
 */
function FeedCarousel({ feed }: { feed: InstagramFeedData }) {
  const { posts, source } = feed;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isTouchingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const [isAutoplayStopped, setIsAutoplayStopped] = useState(false);
  const isLooping = posts.length >= MIN_LOOPING_POSTS;
  const copies = isLooping ? LOOP_COPIES : 1;

  const getStep = useCallback(() => {
    const tiles = scrollerRef.current?.children;
    if (!tiles || tiles.length < 2) {
      return 0;
    }
    return (tiles[1] as HTMLElement).offsetLeft - (tiles[0] as HTMLElement).offsetLeft;
  }, []);

  // Keep the middle of the view inside the middle copy; the copies are identical, so the jump is invisible
  const recenter = useCallback(() => {
    const scroller = scrollerRef.current;
    const loopWidth = getStep() * posts.length;
    if (!scroller || !isLooping || loopWidth <= 0) {
      return;
    }
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    if (center < loopWidth) {
      scroller.scrollLeft += loopWidth;
    } else if (center >= loopWidth * 2) {
      scroller.scrollLeft -= loopWidth;
    }
  }, [getStep, isLooping, posts.length]);

  // Start with the newest post in the middle of the strip
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const firstPost = scroller?.children[posts.length] as HTMLElement | undefined;
    if (!scroller || !firstPost || !isLooping) {
      return;
    }
    scroller.scrollLeft = firstPost.offsetLeft + firstPost.offsetWidth / 2 - scroller.clientWidth / 2;
  }, [isLooping, posts.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !isLooping) {
      return;
    }
    let settleTimer = 0;
    const handleScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        // Never move the strip under a finger or away from a focused tile
        if (!isTouchingRef.current && !isFocusedRef.current) {
          recenter();
        }
      }, SCROLL_SETTLE_MS);
    };
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      window.clearTimeout(settleTimer);
    };
  }, [isLooping, recenter]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !isLooping || isAutoplayStopped || prefersReducedMotion()) {
      return;
    }
    let isInView = false;
    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
    });
    observer.observe(scroller);
    const interval = window.setInterval(() => {
      if (!isInView || document.hidden || isHoveredRef.current || isFocusedRef.current || isTouchingRef.current) {
        return;
      }
      recenter();
      scroller.scrollBy({ left: getStep(), behavior: 'smooth' });
    }, AUTOPLAY_INTERVAL_MS);
    return () => {
      window.clearInterval(interval);
      observer.disconnect();
    };
  }, [isLooping, isAutoplayStopped, recenter, getStep]);

  const stopAutoplay = () => setIsAutoplayStopped(true);

  const scrollByPost = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    stopAutoplay();
    recenter();
    scroller.scrollBy({
      left: direction * getStep(),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  };

  const arrowClassName = 'absolute top-1/2 z-10 hidden md:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text shadow-md transition-colors hover:bg-white hover:text-mustard focus:outline-none focus-visible:ring-2 focus-visible:ring-sage';

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={source === 'instagram' ? 'Recent Instagram posts' : 'Recent photos'}
      className="relative"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <div
        ref={scrollerRef}
        className={`${TRACK_CLASS_NAME} relative overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-none ${isLooping ? 'md:[mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]' : 'mx-auto w-max max-w-full px-4'}`}
        onWheel={event => {
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            stopAutoplay();
          }
        }}
        onTouchStart={event => {
          isTouchingRef.current = true;
          touchStartXRef.current = event.touches[0].clientX;
        }}
        onTouchMove={event => {
          // A sideways swipe takes over; scrolling the page past the strip doesn't
          if (Math.abs(event.touches[0].clientX - touchStartXRef.current) > 10) {
            stopAutoplay();
          }
        }}
        onTouchEnd={() => {
          isTouchingRef.current = false;
        }}
        onTouchCancel={() => {
          isTouchingRef.current = false;
        }}
        onFocus={() => {
          isFocusedRef.current = true;
        }}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            isFocusedRef.current = false;
          }
        }}
      >
        {Array.from({ length: copies }, (_, copy) => posts.map(post => (
          <FeedTile
            key={`${copy}-${post.id}`}
            post={post}
            isClone={copy !== Math.floor(copies / 2)}
            isFromInstagram={source === 'instagram'}
          />
        )))}
      </div>
      {isLooping && <>
        <button type="button" className={`${arrowClassName} left-6`} onClick={() => scrollByPost(-1)} aria-label="Previous photos">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button type="button" className={`${arrowClassName} right-6`} onClick={() => scrollByPost(1)} aria-label="Next photos">
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </>}
    </div>
  );
}

export function InstagramFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const [feed, setFeed] = useState<InstagramFeedData | null>(null);
  const { instagram: profileUrl, instagramHandle } = site.socials;

  // Load the feed only as the section nears the screen, so it never competes with the page above it
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    let isCancelled = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        return;
      }
      observer.disconnect();
      getInstagramFeed().then(data => {
        if (!isCancelled) {
          setFeed(data);
        }
      });
    }, { rootMargin: '600px 0px' });
    observer.observe(section);
    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="instagram-feed-heading" className="pt-16 md:pt-20 pb-6 md:pb-8">
      <div className="container mx-auto px-4 mb-10 md:mb-12 text-center">
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex flex-col items-center">
          <span className="rounded-full bg-gradient-to-tr from-mustard via-mauve to-sage p-[2px]">
            <span className="block rounded-full bg-white p-[3px]">
              <img src={AVATAR_SRC} alt="" className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover" />
            </span>
          </span>
          <span className="mt-3 text-sm tracking-wide text-text/60 transition-colors group-hover:text-mustard">
            @{instagramHandle}
          </span>
        </a>
        <h2 id="instagram-feed-heading" className="mt-1 text-2xl md:text-3xl font-display">
          Follow Along on Instagram
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-text/60">
          Little moments from recent sessions, shared as they bloom.
        </p>
      </div>
      {feed === null ? <FeedSkeleton /> : feed.posts.length > 0 && <FeedCarousel feed={feed} />}
      <div className="mt-10 md:mt-12 text-center">
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="btn gap-2">
          <InstagramIcon aria-hidden="true" className="h-4 w-4" />
          Follow on Instagram
        </a>
      </div>
    </section>
  );
}
