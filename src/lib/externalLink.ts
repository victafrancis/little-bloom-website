export type ExternalLinkBrand = 'instagram' | 'facebook';

export type ExternalLinkTarget = {
  href: string;
  name: string;
  brand: ExternalLinkBrand | null;
};

const BRANDS: Array<{ brand: ExternalLinkBrand; name: string; domain: string }> = [
  { brand: 'instagram', name: 'Instagram', domain: 'instagram.com' },
  { brand: 'facebook', name: 'Facebook', domain: 'facebook.com' }
];

// Returns where a link leads if it takes the visitor off this site, or null for
// everything that stays (same-site paths, mailto:, tel:, downloads)
export const getExternalLinkTarget = (anchor: HTMLAnchorElement, currentUrl: string): ExternalLinkTarget | null => {
  const href = anchor.getAttribute('href');
  if (!href || anchor.hasAttribute('download')) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(href, currentUrl);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol) || url.origin === new URL(currentUrl).origin) {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '');
  const match = BRANDS.find(({ domain }) => host === domain || host.endsWith(`.${domain}`));
  return {
    href: url.href,
    name: match?.name ?? host,
    brand: match?.brand ?? null
  };
};
