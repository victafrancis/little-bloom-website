# Album manager

The album manager at [`/admin`](https://www.littlebloomphotography.com/admin)
is where the four galleries' photos are added, removed, put in order, and given
a cover.

The photos are stored in the `albums` bucket in Supabase, one folder per
gallery. The `album_photos` table lists which photos each gallery shows, and in
what order. A gallery's first photo is its cover, both on the Home and Gallery
pages and at the top of the gallery itself.

## Using the album manager

Log in at `/admin` with the album manager login, then pick a gallery.

- **Add photos** by dragging them from your computer onto the page, or with
  **add photos** (on a phone, this opens your photo library). New photos go at
  the end of the gallery.
- **Reorder** by dragging a photo to a new spot. On a phone, press and hold a
  photo for a moment before dragging. With a keyboard, tab to a photo, press
  Space, move it with the arrow keys, and press Space again.
- **Set the cover** with **Make cover** on a photo. That moves it to the first
  spot, which is the cover. Dragging a photo to the first spot does the same.
- **Remove a photo** with the ✕. Its file is deleted for good when you save.
- **Preview** shows the gallery the way visitors will see it, with your changes.

Nothing changes on the site until you press **Save**. **Discard** undoes
everything since the last save, and the page warns you before you leave with
unsaved changes.

New photos are shrunk so their longest side is at most 2560px, and saved as
high-quality JPEGs (85%). They're never cropped. This keeps galleries fast, and
also drops hidden details like the GPS location the photo was taken at. The
size and quality are set in [`resizeImage.ts`](../src/lib/resizeImage.ts).

If the gallery was changed somewhere else while you were editing (another
tab or device added or removed photos), Save is refused instead of undoing
that change. Reload the gallery to see the latest version.

## How the site reads albums

| Piece | What it does |
| --- | --- |
| [`getGalleryImages()`](../src/lib/supabase.ts) | A gallery's photos, in order. |
| [`getGalleryCoverUrl()`](../src/lib/supabase.ts) | A gallery's cover, which is its first photo. |

Both read every gallery's order in one request, shared for the whole visit.

A gallery with no rows in `album_photos` yet loads straight from its folder,
the way it always has: the newest `cover…` file (or `00.jpg`) first, then the
rest by filename. The album manager adds a gallery's rows the first time it's
opened, in that same order, so the site looks the same when it switches over.
If the table doesn't exist yet, every gallery loads from its folder.

Once a gallery is in the table, the table decides what it shows, so make
changes in the album manager rather than the Supabase dashboard. A file added
to its folder in the dashboard won't appear, and a file deleted there leaves a
"Photo unavailable" tile.

## How the album manager works

| Piece | What it does |
| --- | --- |
| [`Admin`](../src/pages/Admin.tsx) | The `/admin` page: login, then the manager. It loads on its own, so visitors never download it. |
| [`AlbumEditor`](../src/components/admin/AlbumEditor.tsx) | One gallery's photos, upload area, preview and save bar. |
| [`useAlbumDraft()`](../src/lib/useAlbumDraft.ts) | Your unsaved changes to a gallery, and the uploads. |
| [`albumAdmin.ts`](../src/lib/albumAdmin.ts) | Loading, importing, uploading and saving. |
| [`adminSupabase`](../src/lib/adminSupabase.ts) | The logged-in Supabase connection, separate from the visitors' one. |

Photos are uploaded as `<gallery>/<random id>.jpg`, so a new photo never
replaces an old file and the CDN never serves a stale copy. Uploads from a
draft that was never saved are deleted the next time that gallery is opened,
once they're a day old.

## Setup

Do these once, in order.

### 1. Create the login

In Supabase, go to **Authentication → Users → Add user → Create new user**.
Enter `hello@littlebloomphotography.com` and a strong password, keep **Auto
Confirm User** ticked, and create the user.

### 2. Turn off sign-ups

Go to **Authentication → Sign In / Providers**, turn off **Allow new users to
sign up**, and save. Only accounts you create yourself can log in.

### 3. Run the setup SQL

Open the **SQL Editor**, paste this in, and run it.

```sql
-- Which photos each gallery shows, in order. Position 0 is the gallery's cover.
create table public.album_photos (
  id uuid primary key default gen_random_uuid(),
  album_slug text not null,
  storage_path text not null unique,
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  constraint album_photos_path_in_album check (starts_with(storage_path, album_slug || '/')),
  -- Deferred so a save can reshuffle positions within its transaction
  constraint album_photos_position_unique unique (album_slug, position) deferrable initially deferred
);

alter table public.album_photos enable row level security;

create policy "Anyone can view album photos"
  on public.album_photos for select
  to anon, authenticated
  using (true);

grant select on public.album_photos to anon, authenticated;
grant insert, update, delete on public.album_photos to authenticated;

-- The logins allowed to change albums
create table public.album_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- No policies on purpose: only is_album_admin() reads it
alter table public.album_admins enable row level security;

create function public.is_album_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.album_admins where user_id = auth.uid());
$$;

grant execute on function public.is_album_admin() to authenticated;

create policy "Album admins can change album photos"
  on public.album_photos for all
  to authenticated
  using ((select public.is_album_admin()))
  with check ((select public.is_album_admin()));

-- Album admins can list, upload and delete files in the albums bucket
create policy "Album admins can list album files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'albums' and (select public.is_album_admin()));

create policy "Album admins can upload album files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'albums' and (select public.is_album_admin()));

create policy "Album admins can delete album files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'albums' and (select public.is_album_admin()));

-- Saves a gallery in one go: photo_paths in order, the first being the cover.
-- loaded_paths is the gallery as the manager loaded it, so a save can't undo
-- photos someone else added or removed in the meantime.
-- Returns the paths that left the gallery, for the manager to delete from storage.
create function public.save_album(slug text, photo_paths text[], loaded_paths text[])
returns text[]
language plpgsql
security invoker
set search_path = ''
as $$
declare
  removed_paths text[];
begin
  if not public.is_album_admin() then
    raise exception 'Only album admins can save albums' using errcode = '42501';
  end if;

  if coalesce(cardinality(photo_paths), 0) = 0 then
    raise exception 'An album needs at least one photo';
  end if;

  if cardinality(photo_paths) <> (select count(distinct photo.path) from unnest(photo_paths) as photo(path)) then
    raise exception 'A photo is in the album twice';
  end if;

  -- One save per album at a time
  perform pg_advisory_xact_lock(hashtext('save_album:' || slug));

  -- Checked before the files, since a photo someone else removed has no file anymore
  if exists (
    (
      select saved.storage_path from public.album_photos as saved
      where saved.album_slug = slug
      except
      select loaded.path from unnest(loaded_paths) as loaded(path)
    )
    union all
    (
      select loaded.path from unnest(loaded_paths) as loaded(path)
      except
      select saved.storage_path from public.album_photos as saved
      where saved.album_slug = slug
    )
  ) then
    raise exception 'This album was changed somewhere else'
      using errcode = 'PT409', hint = 'Reload the album to see the latest version.';
  end if;

  if exists (
    select 1
    from unnest(photo_paths) as photo(path)
    where not starts_with(photo.path, slug || '/')
      or not exists (
        select 1 from storage.objects as file
        where file.bucket_id = 'albums' and file.name = photo.path
      )
  ) then
    raise exception 'Every photo must be a file in the album''s folder';
  end if;

  with removed as (
    delete from public.album_photos as saved
    where saved.album_slug = slug and saved.storage_path <> all (photo_paths)
    returning saved.storage_path
  )
  select coalesce(array_agg(removed.storage_path), '{}') into removed_paths from removed;

  insert into public.album_photos (album_slug, storage_path, position)
  select slug, photo.path, photo.place - 1
  from unnest(photo_paths) with ordinality as photo(path, place)
  on conflict (storage_path) do update set position = excluded.position;

  return removed_paths;
end;
$$;

revoke execute on function public.save_album(text, text[], text[]) from public, anon;
grant execute on function public.save_album(text, text[], text[]) to authenticated;
```

It should finish with "Success. No rows returned".

### 4. Make the login an album admin

Run this in the SQL Editor:

```sql
insert into public.album_admins (user_id)
select id from auth.users
where email = 'hello@littlebloomphotography.com';
```

To check it worked, this should list the email:

```sql
select users.email
from public.album_admins
join auth.users on users.id = album_admins.user_id;
```

To give another login access later, create it the same way and run the
`insert` with its email. To take access away, delete its row from
`album_admins`. To change the password, use **Send password recovery** on the
user in **Authentication → Users**.

## Checking on it

Each gallery's photos, in order:

```sql
select album_slug, position, storage_path
from public.album_photos
order by album_slug, position;
```

A gallery that isn't listed there still loads from its folder.

Failures are reported to Sentry with the tag `operation`: `get_gallery_images`
or `get_gallery_cover` on the site, and `album_manager_load`,
`album_manager_save`, `album_manager_upload`, `album_manager_remove_files` or
`album_manager_cleanup` in the album manager.
