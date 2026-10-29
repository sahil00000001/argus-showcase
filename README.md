# ARGUS Showcase

The ARGUS product site and film library: one HTML page that presents ARGUS as a product and hosts every film batch.

## Open it

- **Locally:** double-click `index.html`. It works offline; fonts are embedded, and there are no external requests.
- **On a web server:** copy the whole folder as it is (any static host: IIS, nginx, Apache, an S3 bucket). No build step.

Best in Chrome or Edge. The films are H.264 MP4, which every current browser plays.

## What is on the page

| Section | Content |
|---|---|
| Hero and tour | What ARGUS is, plus the full 4:24 tour with clickable chapters |
| The problem | Where data actually leaves: the clipboard, USB, the browser |
| How it works | Sysmon + Argus Agent + browser extension → one event file → Wazuh, and the design rules that keep the parts from conflicting |
| Detections | All ten detections with their real Wazuh rule numbers and levels |
| Control | The optional responses: browser warn/block, USB disable, process stop, SOC notification |
| Privacy | What is collected and what never is; the privacy profiles |
| Trust | Tamper protection and signed policy |
| Deploy | The installer, Intune / Group Policy / Ansible, pilot requirements |
| Proof | Build results, each with the command that reproduces it |
| Films | The film library, by batch, with topic filters |
| Roadmap | What comes next |

Product copy lives in `index.html`. Everything about a film batch lives in that batch's folder.

## Folder structure

```text
ARGUS-Showcase/
  index.html                  the page
  assets/
    css/style.css             design (one dark theme matching the films)
    css/fonts.css             embedded fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono; OFL)
    js/app.js                 loads the batches, builds the tour and the library
    img/argus.svg             the ARGUS mark
  batches/
    manifest.js               list of batch folders, newest first
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

- `index.html#films`: the film library
- `index.html#film-04`: opens and highlights one film (`film-` plus the film number)
- `index.html#tour`: the full tour

## Where the films come from

The films are rendered from code in a separate film project (`node source/render.cjs`, then `python source/master.py` for the full tour); this repository holds only the finished files. On-screen outputs are real captures from the ARGUS build of 29 October 2026; sample data is labelled in the films. See each batch's README for details.

## Hosting on Vercel

The site is static, so it needs no build. In Vercel: **Add New → Project → Import** this repository, keep the framework preset **Other**, leave the build command empty and the output directory as the repository root, then **Deploy**. `vercel.json` adds caching for the videos and a few security headers. Every push to `main` redeploys.
