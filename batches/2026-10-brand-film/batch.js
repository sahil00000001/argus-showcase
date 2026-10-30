/* ============================================================================
   Batch: 2026-10 brand film (the flagship 2:30 story)
   Everything the showcase page shows about this batch lives in this file.
   Paths are relative to this folder. Registered with the page by ARGUS.registerBatch.
   Being the newest batch with a `showcase`, it becomes the film at the top of the page.
   ========================================================================== */
ARGUS.registerBatch({
  id: '2026-10-brand-film',
  title: 'The ARGUS film',
  date: '2026-10-30',
  summary: 'One paste, one night, 48,213 customers. The film plays the leak, rewinds to the same night with ARGUS on the laptop, walks through the hall of data guards, runs all ten detections, and ends on a quiet morning. Narrated, with subtitles, for launches, events and the top of a sales conversation.',
  format: '1920 × 1080 · 30 fps · H.264 · narrated, subtitles on screen',

  showcase: {
    title: 'The ARGUS film',
    src: 'videos/ARGUS-film.mp4',
    poster: 'posters/ARGUS-film.png',
    duration: 150,
    chapters: [
      { t: 0,   n: '01', title: 'One paste, one night' },
      { t: 35,  n: '02', title: 'Same night, with ARGUS' },
      { t: 65,  n: '03', title: 'The hall of data guards' },
      { t: 95,  n: '04', title: 'Ten detections' },
      { t: 115, n: '05', title: 'Your rules, your call' },
      { t: 127, n: '06', title: 'What comes next' },
      { t: 135, n: '07', title: 'The morning after' },
    ],
  },

  films: [
    {
      n: 'film', label: 'Flagship film', key: 'ARGUS-film', topic: 'story', duration: 150,
      title: 'The ARGUS film',
      hook: 'Same night. Same laptop. Now, with ARGUS.',
      audience: 'Everyone: buyers, employees, events',
      shows: 'Arjun pastes the quarter’s customer list into a free AI site and the Broker sells every row. Then the night rewinds: ARGUS checks the paste on the laptop, blocks it, and alerts the security team. The hall of data guards shows where other tools fall short, ten detections play in twenty seconds, and the film ends on a cleaned file and a watchful cat.',
    },
  ],

  topics: { story: 'Story' },

  notes: [
    { title: 'Synthetic data only', body: 'Every name, number and company on screen is invented for the film. Card numbers are standard test values.' },
    { title: 'Claims', body: 'Product claims in the film match the product report. The breach-cost figure on the stat card is cited on screen.' },
    { title: 'Made in code', body: 'Animated in HTML, narrated with an open-licence voice model, scored with music composed for the film.' },
  ],
});
