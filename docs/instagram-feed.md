# Instagram feed

The "Follow Along on Instagram" section above the footer shows the latest posts
from [@littlebloom.photos](https://instagram.com/littlebloom.photos) (up to 50)
on every page.

Until Instagram is connected, or if it ever fails, the section shows photos
from the galleries instead, so it never sits empty.

## How it works

| Piece | What it does |
| --- | --- |
| [`InstagramFeed`](../src/components/InstagramFeed.tsx) | The section and its looping carousel. It loads the feed only as the visitor scrolls near it. |
| [`getInstagramFeed()`](../src/lib/instagram.ts) | Loads `/api/instagram` once per visit, falling back to gallery photos. |
| [`api/instagram.js`](../api/instagram.js) | Fetches posts from the Instagram API. Vercel's edge caches the response for an hour. |
| [`api/instagram-image.js`](../api/instagram-image.js) | Serves post images from our own domain, since Instagram's CDN can block them on other sites. It only serves URLs the feed signed. |
| [`api/instagram-refresh.js`](../api/instagram-refresh.js) | Run daily by the cron in [`vercel.json`](../vercel.json). Refreshes the access token once a week so it never expires. |

## Setup

### 1. Get an Instagram access token

The account must be a professional (Business or Creator) account, which
@littlebloom.photos already is.

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) and create an app.
   When asked for a use case, pick the Instagram one ("Manage messaging & content on Instagram").
2. In the app, open **Instagram → API setup with Instagram business login**.
3. Under **Generate access tokens**, click **Add account** and log in as @littlebloom.photos.
   If Instagram asks you to accept a tester invite, accept it in
   Instagram → Settings → Website permissions → Apps and websites → Tester invites.
4. Click **Generate token** and copy it. This is a long-lived token (60 days).

The app can stay in development mode, since it only reads your own posts.

### 2. Create the token table in Supabase (keeps the token alive)

Instagram tokens expire after 60 days unless they are refreshed, and a refreshed
token has to be stored somewhere. Run this once in the Supabase SQL editor:

```sql
create table public.instagram_token (
  id smallint primary key default 1 check (id = 1),
  access_token text not null,
  refreshed_at timestamptz not null default now(),
  expires_at timestamptz
);

-- No policies on purpose: only the server (service role key) can read or write it
alter table public.instagram_token enable row level security;
```

### 3. Add environment variables in Vercel

Add these under **Project → Settings → Environment Variables**, for Production
and Preview, then redeploy:

| Variable | Required | Value |
| --- | --- | --- |
| `INSTAGRAM_ACCESS_TOKEN` | Yes | The token from step 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Supabase → Project Settings → API keys → `service_role` (or a secret key). Without it the token can't be refreshed and the feed stops after 60 days. Never give it a `VITE_` prefix, since that would ship it to the browser. |
| `CRON_SECRET` | Recommended | Any random string of 16+ characters. Vercel sends it with cron requests, so nobody else can call the refresh endpoint. |

The feed reuses the existing `VITE_SUPABASE_URL` (or `SUPABASE_URL`).

## Checking on it

- Visit `/api/instagram` on the live site to see the JSON feed.
- The first cron run copies the token into the `instagram_token` table. After
  that, `refreshed_at` moves forward about once a week.
- Failures are reported to Sentry with the tag `operation`:
  `instagram_feed`, `instagram_token_read` or `instagram_token_refresh`.

## Reconnecting Instagram

If the token stops working (for example, after a password change), generate a
new one (step 1), update `INSTAGRAM_ACCESS_TOKEN` in Vercel, and redeploy. The
feed notices the stored token is invalid and replaces it with the new one.
