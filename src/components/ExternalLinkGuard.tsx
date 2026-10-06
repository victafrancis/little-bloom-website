import { useEffect, useRef, useState } from 'react';
import { ExternalLinkIcon, FacebookIcon, InstagramIcon, MailIcon } from 'lucide-react';
import { ExternalLinkTarget, getExternalLinkTarget } from '../lib/externalLink';

const DIALOG_SELECTOR = '[data-external-link-dialog]';
const BRAND_ICONS = { instagram: InstagramIcon, facebook: FacebookIcon, email: MailIcon };

const supportsModalDialog = () =>
  typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal === 'function';

type ConfirmDialogProps = {
  target: ExternalLinkTarget;
  onClose: () => void;
};

function ConfirmDialog({ target, onClose }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stayButtonRef = useRef<HTMLButtonElement>(null);
  const Icon = target.brand ? BRAND_ICONS[target.brand] : ExternalLinkIcon;
  const isEmail = target.brand === 'email';
  const description = !isEmail
    ? "You're about to leave Little Bloom Photography."
    : target.emailAddress
      ? `This opens your email app to write to ${target.emailAddress}.`
      : 'This opens your email app.';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (!dialog.open) {
      dialog.showModal();
    }
    // Start on the safe choice, so a stray Enter keeps the visitor here
    stayButtonRef.current?.focus();
  }, []);

  // close() queues its close event, so the Open link is still there when its click navigates
  const closeDialog = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      data-external-link-dialog=""
      aria-labelledby="external-link-title"
      aria-describedby="external-link-description"
      onClose={onClose}
      onClick={event => {
        // A click on the dimmed area around the card counts as cancel
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-white p-0 text-text shadow-xl animate-dialog-in motion-reduce:animate-none backdrop:bg-text/40"
    >
      <div className="px-6 py-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-mauve">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
        <h2 id="external-link-title" className="mt-4 text-xl font-display">
          Open {target.name}?
        </h2>
        <p id="external-link-description" className="mt-2 break-words text-sm text-text/60">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            ref={stayButtonRef}
            type="button"
            className="btn"
            onClick={closeDialog}
          >
            Stay here
          </button>
          <a
            href={target.href}
            target={isEmail ? undefined : '_blank'}
            rel={isEmail ? undefined : 'noopener noreferrer'}
            className="btn bg-mustard/10"
            onClick={closeDialog}
          >
            Open {target.name}
          </a>
        </div>
      </div>
    </dialog>
  );
}

/**
 * Asks "Open Instagram?" (or "Open email?") before any link that leaves the site
 * or switches to another app, so a stray tap can't throw the visitor out of it.
 * One listener on the document covers every link, including ones added later or
 * inside the notes. Ctrl/Cmd/Shift clicks and middle clicks are deliberate, so
 * they go straight through.
 */
export function ExternalLinkGuard() {
  const [target, setTarget] = useState<ExternalLinkTarget | null>(null);

  useEffect(() => {
    // Without modal dialogs, links simply work as before
    if (!supportsModalDialog()) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.closest(DIALOG_SELECTOR)) {
        return;
      }
      const externalTarget = getExternalLinkTarget(anchor, window.location.href);
      if (externalTarget) {
        event.preventDefault();
        setTarget(externalTarget);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return target && <ConfirmDialog target={target} onClose={() => setTarget(null)} />;
}
