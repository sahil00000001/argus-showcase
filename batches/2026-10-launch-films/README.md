# Batch: 2026-10 launch films

Ten short films, one per ARGUS capability, plus the full tour joined from them. Released 29 October 2026.

| | |
|---|---|
| Format | 1920 × 1080, 30 fps, H.264 (limited-range BT.709), silent with text on screen |
| Films | 10, 25–28 seconds each |
| Full tour | `videos/ARGUS-showcase-full.mp4`, 4:24, with a chapter per film (presentation order 01, 02, 04, 03, 05–10) |
| Content | `batch.js` (titles, hooks, audiences, descriptions, chapter times, notes) |

| # | File | Film | For |
|---|---|---|---|
| 01 | `01-what-is-argus.mp4` | What ARGUS is | Executive sponsor |
| 02 | `02-copy-paste-caught.mp4` | Copy, paste, caught | CISO, head of security |
| 03 | `03-the-usb-stick.mp4` | The USB stick | Security operations |
| 04 | `04-the-ai-chat-box.mp4` | The AI chat box | CIO, CTO |
| 05 | `05-ten-detections.mp4` | Ten detections, one alert each | SOC lead |
| 06 | `06-watching-without-spying.mp4` | Watching without spying | HR, legal, data protection officer |
| 07 | `07-try-to-switch-it-off.mp4` | Try to switch it off | CISO, auditor |
| 08 | `08-policy-you-can-trust.mp4` | Policy you can trust | Compliance, IT governance |
| 09 | `09-one-installer.mp4` | One installer, every laptop | Endpoint and IT operations |
| 10 | `10-proof-not-promises.mp4` | Proof, not promises | Technical evaluator |

## What is real and what is sample data

- **Real:** detection results from the ARGUS engine (captured from the installer's embedded runtime), policy sign / verify / tamper-rejected output, build steps and installer sizes (138.5 MB, 133.8 MB), test counts (236/236), rule numbers and levels, the browser extension's dialog text, the privacy window text (abridged), the service permissions.
- **Sample data, labelled in the films:** user and host names (CORP\e10442), `customers_q3.csv`, the USB drive name, the address 10.0.0.5. The card number is the standard test number 4111 1111 1111 1111; the PAN and Aadhaar are synthetic.
- **Shown, not captured:** the "Access is denied" terminal in film 07 is the expected result of the installer's service permissions (labelled "Expected result"). Film 04 sets AI chat sites to "warn" for the demo; the shipped default is "detect".
- **Placeholder:** `<<ORG_NAME>>` appears in one real output line in film 08 because the organisation name is not configured yet.

No testimonials, customer logos, attributed quotes or performance claims appear in any film.

## Source

The films are rendered from code in a separate film project (`node source/render.cjs --jobs 4`, then `python source/master.py`). After a re-render, copy the new files into `videos/` and `posters/`.
