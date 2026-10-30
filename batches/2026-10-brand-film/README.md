# Batch: 2026-10 brand film

The flagship ARGUS film, a single 2:30 story released on 30 October 2026. Because it is the newest batch with a `showcase`, the page plays it at the top.

| | |
|---|---|
| Format | 1920 × 1080, 30 fps, H.264, AAC stereo at −16 LUFS, English narration with subtitles burned in |
| Length | 2:30 (4,500 frames) |
| File | `videos/ARGUS-film.mp4` (poster: `posters/ARGUS-film.png`, the “Paste blocked” moment) |
| Content | `batch.js` (summary, seven chapter marks, notes) |

**Chapters**

| Time | Chapter |
|---|---|
| 0:00 | One paste, one night |
| 0:35 | Same night, with ARGUS |
| 1:05 | The hall of data guards |
| 1:35 | Ten detections |
| 1:55 | Your rules, your call |
| 2:07 | What comes next |
| 2:15 | The morning after |

**Source.** The film is rendered in the film project at `argus-film-kit/argus-film/fastcut/`, where `source/render.cjs`, `source/mix.py` and `source/assemble.py` produce `out/ARGUS-fastcut-v2.mp4`. Copy that file here as `videos/ARGUS-film.mp4`.

**Content rules.** All names, numbers and companies on screen are invented. Card numbers are standard test values. Product claims follow the ARGUS project report. Lists of sites and devices are called the “block list” and the “approve list”, on screen and in the narration.

**Still temporary.** The narration uses an open-licence voice model (Kokoro-82M, Apache-2.0), and the score was composed in code for the film. Replace both with a recorded voice and a commissioned score before paid media.
