# ARGUS Showcase

The ARGUS product site and film library: eight interactive pages that present ARGUS as a product and host every film batch.

## Open it

- **Locally:** double-click `index.html`. It works offline; fonts are embedded, and there are no external requests.
- **On a web server:** copy the whole folder as it is (any static host: IIS, nginx, Apache, an S3 bucket). No build step.

Best in Chrome or Edge. The films are H.264 MP4, which every current browser plays. Motion respects the visitor's reduced-motion setting.

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | The watchful cat (its eyes follow the cursor) over a stream of data where sensitive items get flagged; a sample alert ticker; animated stats; sourced “why now” figures; the flagship film; links to every page |
| Platform | `platform.html` | Animated architecture map with packets moving through it; “follow one event” in six steps with the event JSON at each step; design rules; footprint; proof numbers |
| Detections | `detections.html` | The ten detections as a filterable explorer (by surface and level), a drawer with each detection's story, a severity chart and the reference table |
| Try it | `demo.html` | A live lab: paste text and the recognisers (Luhn, Verhoeff, PAN, IFSC, connection strings, credentials) run in the browser, then the paste guard decides and the simplified event is shown |
| Compare | `compare.html` | The category positioning chart linked to the comparison table, and why the gaps matter |
| Trust | `trust.html` | Privacy-profile switcher on a replica of the tray panel; a “try to switch it off” terminal; a real ECDSA P-256 signed-policy check you can tamper with |
| Deploy | `deploy.html` | Install-command builder, rollout tabs (Intune, Group Policy, Ansible, by hand), ports, requirements and a pilot checklist |
| Films | `films.html` | The flagship film with chapters, then the library by batch |

Shared header and footer come from `assets/js/site.js`; product facts used by several pages live in `assets/js/data.js`; page behaviour is in `assets/js/pages.js`; the film library is built by `assets/js/app.js`.

## Folder structure

```text
ARGUS-Showcase/
  index.html platform.html detections.html demo.html compare.html trust.html deploy.html films.html
  assets/
    css/site.css              design system (one dark theme; teal for the product, gold for the cat)
    css/fonts.css             embedded fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono; OFL)
    js/site.js                header, footer, menu, reveals, counters, the cat, the data-flow canvas, ticker, film modal
    js/data.js                detections, ticker, sourced figures, demo samples
    js/pages.js               the interactive parts of each page
    js/app.js                 loads the film batches, builds the tour and the library
    img/argus.svg             the ARGUS cat mark
  batches/
    manifest.js               list of batch folders, newest first
    2026-10-brand-film/       batch 2: the flagship 2:30 film (plays at the top of the Films page)
    2026-10-launch-films/     batch 1: 10 films + the full tour
      batch.js                all content for this batch (titles, descriptions, chapters, notes)
      README.md
      videos/                 *.mp4
      posters/                *.png (one per film)
```

## Add the next batch of films

1. Copy `batches/2026-10-launch-films` to a new folder, for example `batches/2027-01-customer-stories`.
2. Replace `videos/` and `posters/` with the new files. Each film needs `videos/<key>.mp4` and `posters/<key>.png`.
3. Edit the new `batch.js`: `id` (the folder name), `title`, `date`, `summary`, `films` (one entry per film, `key` matching the file names), `topics`, and `notes`. Remove the `showcase` block if the batch has no joined tour.
4. Add the folder name to `batches/manifest.js`.

The page sorts batches by `date` and shows the newest first, with a tab for each batch. The product tour at the top uses the newest batch that has a `showcase`. A missing video file shows a message on its card instead of breaking the page.

## Links you can share

- `films.html#film-04`: opens and highlights one film (`film-` plus the film number)
- `films.html#tour`: the flagship film with chapters
- `trust.html#tamper`, `trust.html#signed`, `deploy.html#pilot`: jump to a section

## Where the films come from

The films are rendered from code in a separate film project (`node source/render.cjs`, then `python source/master.py` for the full tour); this repository holds only the finished files. On-screen outputs are real captures from the ARGUS build of 29 October 2026; sample data is labelled in the films. See each batch's README for details.

## Hosting on Vercel

The site is static, so it needs no build. In Vercel: **Add New → Project → Import** this repository, keep the framework preset **Other**, leave the build command empty and the output directory as the repository root, then **Deploy**. `vercel.json` adds caching for the videos and a few security headers. Every push to `main` redeploys. With `cleanUrls`, pages are also reachable without `.html` (for example `/demo`).

**Make it public.** If visitors are sent to a Vercel login page, turn off Vercel Authentication for production in **Project → Settings → Deployment Protection**.
