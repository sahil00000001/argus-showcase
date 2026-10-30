/* ============================================================================
   ARGUS site data: the facts every page draws from. Product facts follow the
   ARGUS v0.6 project report; nothing here is invented beyond the labelled
   sample data (test card numbers, synthetic Aadhaar and PAN values).
   ========================================================================== */
window.ARGUS_DATA = {
  /* the ten detections */
  detections: [
    { n: 1, name: 'Production data into a local app', surface: 'clipboard', levels: [12], rules: '110110 · 110111',
      trigger: 'Rows copied from a production tool (SSMS, psql, DBeaver, a remote desktop) and pasted into Notepad, or saved by a local editor.',
      story: ['<b>Dev runs a query</b> in the SQL client and copies 214 rows of production data.', '<b>He pastes them into Notepad</b> to tidy them up.', '<b>ARGUS sees the path:</b> the copy came from a production tool and landed in a local editor. One alert, level 12.'],
      signal: 'Argus user agent (clipboard source and target)', recorded: 'Source and target application, the size of the copy, sensitive types found. Never the rows.', response: 'Alert only', film: '02' },
    { n: 2, name: 'Sensitive data in any app', surface: 'clipboard', levels: [12, 15], rules: '110120–110129',
      trigger: 'Card, Aadhaar, PAN, IFSC or account numbers, connection strings or credentials found in the clipboard or in files.',
      story: ['<b>Priya copies a card number</b> out of a chat window.', '<b>The local inspector checks it in memory:</b> 16 digits, Luhn checksum passes.', '<b>One alert</b> with the type and count only. Card numbers are critical, so the level is 15.'],
      signal: 'Local inspector (Microsoft Presidio, on 127.0.0.1)', recorded: 'Recogniser type and count, where it was found. Never the text.', response: 'Alert only', film: '05' },
    { n: 3, name: 'Production data to USB', surface: 'usb', levels: [12, 15], rules: '110210 · 110211',
      trigger: 'A file with production lineage written to a removable drive; critical when it contains critical data.',
      story: ['<b>Sam drags export.csv</b> onto a USB drive. The copy completes.', '<b>ARGUS checks the file</b>: production lineage, and card numbers inside.', '<b>A critical alert</b> reaches the SOC. If you switched the response on, new USB storage stays off for one hour.'],
      signal: 'Argus Agent (removable media)', recorded: 'File name, size, drive, sensitive types and counts.', response: 'Optional: USB storage off for 1 hour; stop the copying process; notify the SOC', film: '03' },
    { n: 4, name: 'USB drive not on the approve list', surface: 'usb', levels: [8], rules: '110220',
      trigger: 'USB mass storage that is not on the approve list is connected.',
      story: ['<b>An unknown stick</b> is plugged into the laptop.', '<b>ARGUS compares the device</b> with the approve list in the signed policy.', '<b>Not on the list:</b> one alert, level 8.'],
      signal: 'Argus Agent (USB devices)', recorded: 'Device vendor, product and serial, time connected.', response: 'Alert only', film: '03' },
    { n: 5, name: 'Site on the block list', surface: 'browser', levels: [8], rules: '110310',
      trigger: 'A visit to a site on the block list, such as paste and file-sharing sites.',
      story: ['<b>Arjun opens a paste site</b> in a managed browser.', '<b>The extension matches the site</b> against the block list.', '<b>One alert</b>, level 8. The site address is kept without query details.'],
      signal: 'Browser extension (Chrome and Edge)', recorded: 'Site address without query details, time of visit.', response: 'Alert only', film: '04' },
    { n: 6, name: 'Repeated visits', surface: 'browser', levels: [5], rules: '110320',
      trigger: 'Ten or more visits to the same site within an hour.',
      story: ['<b>Dev reloads the same site</b>, again and again.', '<b>The tenth visit inside an hour</b> crosses the threshold.', '<b>One informational alert</b>, level 5, for the Insider Risk dashboard.'],
      signal: 'Browser extension', recorded: 'Site, visit count, time window.', response: 'Alert only', film: '05' },
    { n: 7, name: 'Long time on one site', surface: 'browser', levels: [3], rules: '110330',
      trigger: 'An hour or more spent on a single site.',
      story: ['<b>One tab, one site</b>, for over an hour.', '<b>The extension tracks time on site</b>, not what is on the page.', '<b>A low-level signal</b>, level 3, that adds context to other alerts.'],
      signal: 'Browser extension', recorded: 'Site and time on site.', response: 'Alert only', film: '05' },
    { n: 8, name: 'Sensitive paste or upload', surface: 'browser', levels: [12, 15], rules: '110340 · 110341',
      trigger: 'Sensitive data pasted or uploaded to webmail, personal cloud or AI chat sites.',
      story: ['<b>Someone pastes a customer list</b> into an AI chat.', '<b>The paste guard checks it first:</b> card numbers, Aadhaar, PAN.', '<b>Your policy decides:</b> detect, warn, or block per site class. The alert carries the type and count.'],
      signal: 'Browser extension paste and upload guard', recorded: 'Site class, recogniser types and counts, the decision.', response: 'Optional per site class: warn or block', film: '04' },
    { n: 9, name: 'After-hours use', surface: 'system', levels: [5], rules: '110410 · 110411',
      trigger: 'Application use between 8 pm and 7 am, or at weekends.',
      story: ['<b>2:14 AM</b>, the spreadsheet app comes to the foreground.', '<b>ARGUS notes the time window</b> from the policy.', '<b>An informational alert</b>, level 5, that only matters alongside others.'],
      signal: 'Argus user agent (application usage)', recorded: 'Application and time; window titles only as an unreadable fingerprint.', response: 'Alert only', film: '05' },
    { n: 10, name: 'Tamper attempt', surface: 'system', levels: [15], rules: '110910',
      trigger: 'The ARGUS service stopped outside maintenance, or killed and restarted.',
      story: ['<b>Someone runs</b> <code>sc stop ArgusService</code> as a local administrator.', '<b>Windows refuses:</b> only the installer, Intune or Group Policy may stop it.', '<b>A critical tamper alert</b>, level 15. If the process is killed, Windows restarts it.'],
      signal: 'Argus service and Windows service control', recorded: 'What was attempted, by which account, the outcome.', response: 'Always critical', film: '07' },
  ],
  surfaces: { clipboard: 'Clipboard and files', usb: 'USB', browser: 'Browser', system: 'Device and system' },

  /* example alert stream for the home ticker (synthetic): what happened, what ARGUS did, which team, when */
  ticker: [
    { l: 15, what: 'Card numbers pasted into an AI chat', did: 'Paste blocked', who: 'Finance', at: '09:14' },
    { l: 12, what: '214 production rows pasted into Notepad', did: 'Alert sent to the SOC', who: 'Engineering', at: '09:31' },
    { l: 8, what: 'Unknown USB stick plugged in', did: 'Not on the approve list', who: 'Sales', at: '10:02' },
    { l: 15, what: 'Customer export with 48 card numbers copied to USB', did: 'USB storage off for 1 hour', who: 'Support', at: '10:47' },
    { l: 12, what: 'PAN shared in a chat window', did: 'Alert sent to the SOC', who: 'HR', at: '11:20' },
    { l: 8, what: 'Paste site opened', did: 'Site is on the block list', who: 'Engineering', at: '11:58' },
    { l: 15, what: 'Attempt to stop the ARGUS service', did: 'Access denied, tamper alert', who: 'IT', at: '12:05' },
    { l: 15, what: 'Aadhaar numbers uploaded to personal cloud', did: 'Warning shown to the user', who: 'Operations', at: '13:40' },
    { l: 5, what: 'Same site opened 10 times in an hour', did: 'Logged for context', who: 'Marketing', at: '14:15' },
    { l: 5, what: 'Spreadsheet in use at 2:14 AM', did: 'Logged for context', who: 'Finance', at: '02:14' },
  ],

  /* every film, for the home film strip (files live in batches/) */
  films: [
    ['batches/2026-10-brand-film', 'ARGUS-film', 'Flagship · 2:30', 'The ARGUS film'],
    ['batches/2026-10-launch-films', 'ARGUS-showcase-full', 'Full tour · 4:24', 'All ten capabilities'],
    ['batches/2026-10-launch-films', '01-what-is-argus', 'Film 01', 'What ARGUS is'],
    ['batches/2026-10-launch-films', '02-copy-paste-caught', 'Film 02', 'Copy, paste, caught'],
    ['batches/2026-10-launch-films', '03-the-usb-stick', 'Film 03', 'The USB stick'],
    ['batches/2026-10-launch-films', '04-the-ai-chat-box', 'Film 04', 'The AI chat box'],
    ['batches/2026-10-launch-films', '05-ten-detections', 'Film 05', 'Ten detections, one alert each'],
    ['batches/2026-10-launch-films', '06-watching-without-spying', 'Film 06', 'Watching without spying'],
    ['batches/2026-10-launch-films', '07-try-to-switch-it-off', 'Film 07', 'Try to switch it off'],
    ['batches/2026-10-launch-films', '08-policy-you-can-trust', 'Film 08', 'Policy you can trust'],
    ['batches/2026-10-launch-films', '09-one-installer', 'Film 09', 'One installer, every laptop'],
    ['batches/2026-10-launch-films', '10-proof-not-promises', 'Film 10', 'Proof, not promises'],
  ],

  /* sourced market facts (cited where shown) */
  why: [
    { big: '₹25.5 crore', cls: 'red', text: 'Average cost of a data breach in India in 2026, an all-time high.', src: 'IBM India newsroom, 2026', url: 'https://in.newsroom.ibm.com/India-Records-its-Highest-Average-Cost-of-a-Data-Breach-2026' },
    { big: '+15.9%', cls: '', text: 'Rise in that average in one year, from ₹22 crore.', src: 'IBM India newsroom, 2026', url: 'https://in.newsroom.ibm.com/India-Records-its-Highest-Average-Cost-of-a-Data-Breach-2026' },
    { big: '₹1.79 crore', cls: 'gold', text: 'Average extra breach cost where shadow AI was present in India.', src: 'IBM India newsroom, 2026', url: 'https://in.newsroom.ibm.com/India-Records-its-Highest-Average-Cost-of-a-Data-Breach-2026' },
    { big: 'Up to ₹250 crore', cls: 'red', text: 'DPDP penalty for failing to keep reasonable security safeguards. Full compliance is due 13 May 2027.', src: 'PIB, DPDP Rules 2025 notified', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf' },
  ],

  /* demo samples: test card numbers, synthetic Aadhaar (Verhoeff-valid) and PAN values */
  samples: {
    'Customer export': 'name,phone,card,pan,aadhaar\nA. Rao,+91 98200 12345,4111 1111 1111 1111,AAAPZ1234C,2345 6789 0124\nS. Iyer,+91 99300 54321,5555 5555 5555 4444,BBBPY5678D,3456 7890 1238\nR. Mehta,+91 97400 67890,3782 822463 10005,CCCPX9012E,4567 8901 2341',
    'Chat message': 'hey, can you put the renewal on this card? 5555-5555-5555-4444 exp 09/28. my PAN is AAAPZ1234C if they ask',
    'Config file': 'Server=prod-sql01;Database=crm;User Id=app_rw;Password=Winter2026!;\naws_access_key_id = AKIAIOSFODNN7EXAMPLE\nbranch IFSC ABCD0001234, account no 001234567890',
    'Harmless note': 'Lunch at 1? The Q3 deck is in the shared drive. Order 4111 shipped on Monday, and the meeting room is 2345.',
  },
};
