/* ============================================================================
   Batch: 2026-10 launch films
   Everything the showcase page shows about this batch lives in this file.
   Paths are relative to this folder. Registered with the page by ARGUS.registerBatch.
   ========================================================================== */
ARGUS.registerBatch({
  id: '2026-10-launch-films',
  title: 'Launch film series',
  date: '2026-10-29',
  summary: 'Ten short films, one per capability, made for client presentations. Each film follows one buyer’s problem, shows ARGUS solving it on screen, and ends on the same sign-off. They are silent, with all text on screen, so they play well on a meeting-room display.',
  format: '1920 × 1080 · 30 fps · H.264 · silent, text on screen',

  /* the joined master, in presentation order, with chapter marks (seconds) */
  showcase: {
    title: 'The full ARGUS tour',
    src: 'videos/ARGUS-showcase-full.mp4',
    poster: 'posters/01-what-is-argus.png',
    duration: 263.7,
    chapters: [
      { t: 0.0,   n: '01', title: 'What ARGUS is' },
      { t: 26.5,  n: '02', title: 'Copy, paste, caught' },
      { t: 53.1,  n: '04', title: 'The AI chat box' },
      { t: 80.7,  n: '03', title: 'The USB stick' },
      { t: 107.7, n: '05', title: 'Ten detections, one alert each' },
      { t: 133.1, n: '06', title: 'Watching without spying' },
      { t: 158.9, n: '07', title: 'Try to switch it off' },
      { t: 185.3, n: '08', title: 'Policy you can trust' },
      { t: 211.9, n: '09', title: 'One installer, every laptop' },
      { t: 238.1, n: '10', title: 'Proof, not promises' },
    ],
  },

  topics: {
    platform: 'Platform',
    detection: 'Detections',
    control: 'Enforcement',
    trust: 'Privacy and trust',
    ops: 'Deployment and proof',
  },

  films: [
    {
      n: '01', key: '01-what-is-argus', topic: 'platform', duration: 26.5,
      title: 'What ARGUS is',
      hook: 'Your data leaves through the laptop.',
      audience: 'Executive sponsor',
      shows: 'Three everyday exits (a file to USB, a paste into an AI chat, card numbers in Notepad), then how ARGUS is built: Sysmon, the Argus Agent and the Wazuh agent on each laptop, feeding one self-hosted platform. Ends on the four headline numbers.',
    },
    {
      n: '02', key: '02-copy-paste-caught', topic: 'detection', duration: 26.6,
      title: 'Copy, paste, caught',
      hook: 'The riskiest app on the laptop is Notepad.',
      audience: 'CISO, head of security',
      shows: 'Six pieces of text pass the on-laptop inspector. Card, PAN, Aadhaar, a database connection string and an email address are recognised with their real scores; a lunch message is correctly ignored. The resulting alert records the type and count, never the copied text.',
    },
    {
      n: '03', key: '03-the-usb-stick', topic: 'control', duration: 27.0,
      title: 'The USB stick',
      hook: 'A customer list is leaving on a USB stick.',
      audience: 'Security operations',
      shows: 'An unapproved USB stick, a file written by a production tool, and card numbers inside it combine into one critical alert. With the optional responses turned on, USB storage is disabled for an hour and the copying process is stopped; system and security processes are never touched.',
    },
    {
      n: '04', key: '04-the-ai-chat-box', topic: 'control', duration: 27.6,
      title: 'The AI chat box',
      hook: 'Your next data leak starts with Ctrl + V.',
      audience: 'CIO, CTO',
      shows: 'A card number pasted into an AI chat is held by the ARGUS browser extension, which shows its real warning. The user cancels and nothing reaches the site. Then the policy behind it: webmail, personal cloud and AI chat sites, each set to detect, warn or block.',
    },
    {
      n: '05', key: '05-ten-detections', topic: 'detection', duration: 25.4,
      title: 'Ten detections, one alert each',
      hook: 'One copy to USB. Two tools. Two alerts.',
      audience: 'SOC lead',
      shows: 'All ten detections with their real rule numbers and alert levels. Supporting signals, such as the Sysmon file event behind a USB copy, add context to an alert instead of raising a second one.',
    },
    {
      n: '06', key: '06-watching-without-spying', topic: 'trust', duration: 25.8,
      title: 'Watching without spying',
      hook: 'Your people will ask what you are watching.',
      audience: 'HR, legal, data protection officer',
      shows: 'The window every employee can open from the ARGUS tray icon, listing what is collected and what never is. Switching the privacy profile to EU-strict turns application tracking off.',
    },
    {
      n: '07', key: '07-try-to-switch-it-off', topic: 'trust', duration: 26.4,
      title: 'Try to switch it off',
      hook: 'Step one for a leaver: switch the agent off.',
      audience: 'CISO, auditor',
      shows: 'An administrator tries to stop and disable the ARGUS service and is refused. Killing the process works, but Windows restarts it and ARGUS reports the kill as a critical tamper alert. Closes on the real service permissions from the installer.',
    },
    {
      n: '08', key: '08-policy-you-can-trust', topic: 'trust', duration: 26.6,
      title: 'Policy you can trust',
      hook: 'Who changed the blocklist last Tuesday?',
      audience: 'Compliance, IT governance',
      shows: 'One policy file produces both the server lookup lists and the laptop policy. The policy is signed and verified; after it is edited, verification fails with “signature invalid” and laptops keep their last good policy.',
    },
    {
      n: '09', key: '09-one-installer', topic: 'ops', duration: 26.2,
      title: 'One installer, every laptop',
      hook: 'Rolling out an agent shouldn’t need a desk visit.',
      audience: 'Endpoint and IT operations',
      shows: 'The real build pipeline checks its downloads, builds and signs one installer (138.5 MB), then the three ways to deploy it: Intune, Group Policy, and Ansible for the server.',
    },
    {
      n: '10', key: '10-proof-not-promises', topic: 'ops', duration: 25.6,
      title: 'Proof, not promises',
      hook: 'Every vendor says it works. Here is the evidence.',
      audience: 'Technical evaluator',
      shows: 'Six numbers from this build: 236 of 236 tests passing, 46 rule test cases, all 10 detections mapped, zero build warnings, 10 design rules checked automatically, 40 pinned components. Then every capability at once.',
    },
  ],

  /* honesty notes shown with the batch */
  notes: [
    { title: 'Real on screen', body: 'Detection results from the ARGUS engine, policy signing and rejection output, build steps and installer sizes, test counts, rule numbers and alert levels, the browser extension’s dialog text, the privacy window text (abridged) and the service permissions.' },
    { title: 'Sample data', body: 'User and host names (such as CORP\\e10442), the file customers_q3.csv, the USB drive name and the address 10.0.0.5 are invented and labelled “Sample data” in the films. The card number is the standard test number 4111 1111 1111 1111; the PAN and Aadhaar numbers are synthetic.' },
    { title: 'Shown, not captured', body: 'The “Access is denied” terminal in film 07 is the expected result of the installer’s service permissions and is labelled that way. Film 04 sets AI chat sites to “warn” for the demo; the shipped default is “detect”.' },
  ],
});
