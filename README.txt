# NASA Moon Kids — enhancement bundle

## Files
- `NASA_Machines_on_the_Moon_Kids.html` — original page with one script include added after the existing application script.
- `NASA_Moon_Kids.css` — stylesheet. A "THEME V2" block at the end sets the new colors, font and unified buttons.
- `moon-kids-enhancements.js` — progressive enhancements and persistence patch.

## Integration
Keep all three files in the same folder. Open `NASA_Machines_on_the_Moon_Kids.html` through a local web server (recommended) or your existing hosting. The HTML already includes the enhancement script at the end of `<body>`, after the original inline application script. Do not add a second script tag.

The Three.js CDN and Google Fonts links from the original page are retained. An internet connection is needed for those external assets. The site itself still uses the original machine data and Base64 images.

## What changed
- Replaced the original empty `save()` at runtime with a debounced save to the existing `moonkids` key.
- Preserves the existing `S.a`, explorer name, and mute preference structure.
- Handles malformed/blocked localStorage safely and avoids writes when the serialized state has not changed.
- Flushes pending progress when the page is hidden or closed.
- Keeps the manual Save button and its success/failure feedback.
- Adds reduced-motion-aware section/card reveal effects, subtle control feedback, and small click sparkles.
- Makes the stars control keyboard-operable and improves its accessible label.
- Uses event delegation for feedback so dynamically rendered game buttons are covered.

## Preservation notes
The original HTML, machine records, Three.js implementation, routing, games, sound code, video upload logic, CSS, and large Base64 image payloads are retained. Only the new script include was added to the HTML. The separate CSS file is byte-for-byte unchanged.

## Verification
Static integrity checks confirm:
- The original Base64 data assignment and machine dataset remain in the HTML.
- The enhancement script is loaded after the original inline application script.
- The existing CSS file is unchanged.
- The enhancement file contains the save implementation, storage error handling, reduced-motion handling, and delegated interaction logic.

A real browser session was not available in this build environment, so interactive runtime checks (Three.js/WebGL, audio, video upload, mobile touch, and browser console) are not claimed as passed. Please run the checklist in the project brief in a browser after integration.

## Update: voice, "Tell me more", clickable cards
- Machine voice: say() is now a bright, high-pitched, childlike voice (prefers child/female English voices such as Microsoft Ana, Samantha, Google US English) and speaks sentence by sentence.
- "Tell me more" now disappears once every fact is shown (a CSS rule was overriding the hidden attribute).
- Clicking anywhere on a machine card opens its information page.

## Update 2: questions, buttons, copyright, emojis, font, colors, glitches
- Questions: every machine now has 3 questions that name the machine (no more vague "What do I listen for?"). The machine page and the Moon Quiz pick one at random.
- Buttons: one shared style for every button (nav buttons, links, quiz options).
- Copyright: states that all machine pictures are taken from the NASA website (nasa.gov) and belong to NASA.
- Emojis: removed from headings, buttons and messages. Kept only the star counter, sound icon, sticker icons and the jump-game astronauts.
- Font: Poppins (Google Fonts). Colors: NASA blue, orange-red and teal on a light background.
- Glitch fixes: removed hover movement on cards/buttons (it made the cards flicker), removed the page fade-in, smooth-scroll jump, floating Moon, click sparkles, delayed card reveal and shake animations. Confetti is now plain colored pieces.

## Update 3: dark space theme, plain buttons, no name field
- Whole site now uses a dark space theme that matches the welcome screen (THEME V3 block at the end of the CSS).
- Buttons are plain: flat, small corner radius, one shared style.
- The explorer-name field and the "Hi, name" greeting were removed.

## Update 4: blue-only palette, outlined buttons, soft-blue headings
- Removed red, green and gold everywhere (cards, timeline, answer feedback, 3D markers, confetti). Correct/wrong answers are shown with blue shades.
- Buttons are now outlined (blue border, fill on hover).
- Headings and the first-screen text are soft blue instead of white; the welcome Moon is dimmed so the text stays readable.
- The star counter is now text ("Stars: N") instead of a yellow emoji.

## Update 5: friendly buttons + subtle page transition
- Buttons: solid blue, rounded, with a small bottom edge that presses down when clicked (same style everywhere, no hover movement).
- Page changes now use a very short, gentle fade (0.3s, a few pixels of rise) restarted on every navigation, including machine-to-machine. Disabled automatically for users who prefer reduced motion.

## Update 6: look matched to the reference page
- Colors: near-black background (#07090f), card #111723, gold accent #ffcf4a, muted blue-grey text, grey Moon, same gold 3D markers as the reference.
- Buttons: gold outlined pill that fills gold on hover; "primary" buttons (.f) are filled gold from the start. Nav buttons use the same gold-outline pill.
- Navigation: underline style with gold underline on the active/hovered page.
- Correct answers fill gold, wrong answers dim (no red/green).
- Headings use a soft gold-cream instead of pure white.


## Update 7: navigation and button refinement
- All internal page links now use the current URL hash as the single source of truth, so machine detail links, back/next links, top navigation and browser history stay in sync.
- The active top-navigation item now exposes `aria-current="page"` for accessibility.
- Navigation links use clear rounded active states instead of a small underline only.
- Primary actions use a filled gold pill; secondary actions use a gold outline. Save/sound/reset controls, back links and machine previous/next links share the same visual family.
- Added mobile sizing and reduced-motion support for the refined controls.

## Verification update
- Inline application JavaScript passes `node --check`.
- Enhancement JavaScript passes `node --check`.
- Static checks confirm the URL-driven router, active-navigation accessibility state and new button styles are present.
- Browser-based visual testing was not available in this environment.

## Update 8: automatic light / dark appearance
- The site now follows the visitor's `prefers-color-scheme` setting automatically.
- Light appearance uses pale surfaces with dark, high-contrast text and coordinated blue / warm-gold accents.
- Dark appearance retains the near-black lunar palette, gold accents and readable light text.
- The browser theme-color metadata also switches between light and dark values.
- No toggle or JavaScript is required; the appearance updates when the system/browser color-scheme preference changes.


## Update 10: childlike buttons (chunky, rounded, press-down edge) and a few emoji on main buttons, star counter and correct answer

## Update 9: consistency clean-up (one stylesheet, matching names)
- CSS: the eight stacked theme layers (with many !important overrides that fought each other) were replaced by ONE stylesheet. Light and dark both come from the same variables, so nothing is left over from an older theme (no white buttons in dark mode, no pale label boxes, no hard background seam, no pink/mint/purple, no 3D "pressed" buttons, no star emoji in the counter).
- Buttons: one family everywhere (gold outline pill, filled for primary actions, same shape for nav controls, back links, previous/next and quiz options). No hover movement.
- Headings: one hierarchy (Cormorant Garamond for headings, Inter for everything else). Labels above headings are plain accent-colored text on every page.
- Quiz/answers: right = filled accent, wrong = dashed and dimmed (no red/green). The four game cards now share the same layout (title first) and sit in a 2 x 2 grid.
- "Tell me more" now really disappears after the last fact (the new button style had hidden it from the [hidden] rule; fixed).
- Names now match between the menu, page labels, headings and browser tab: Machines, Spin the Moon, Play, Timeline. Home tiles use the same names and each goes to a different page.
- Text: removed stray leading spaces, "Surveyor 3 — Surveyor 3" repeats (mission is now "Surveyor Program"), arrows are all "→", locked stickers show "?" instead of an emoji, confetti uses the site colors.
- Behavior, data, saving, games and 3D scene are unchanged.

## Update 11: recorded voice, same on every device
- The machine voice no longer depends on the device's built-in speech voice (which sounded different on every phone/PC). "Read to me" and "tap the picture to say hi" now play pre-recorded clips from the new `audio/` folder.
- 14 clips: `<machine-id>-read.mp3` (full description) and `<machine-id>-hi.mp3` (short greeting) for all 7 machines.
- All clips were processed the same way: silence trimmed, low rumble filtered, light compression, then matched to the same loudness (-16 LUFS, peaks below -1.5 dB), 44.1 kHz mono MP3 (plays on iPhone, Android, Windows, Mac, all browsers). Total size is under 1 MB.
- The first tap on the page unlocks audio on iPhone/iPad (Safari requirement); the beep sounds also resume automatically if the browser suspends them.
- Mute stops the voice immediately, and leaving a page stops it too.
- If a clip is missing or cannot play, the old speech-synthesis voice is used as a fallback.
- Keep the `audio/` folder next to the HTML file.


## Fact-check update (November 2026)
- Clarified that September 30, 1977 was the end of NASA's ALSEP operations, not a standalone switch-off date for the Apollo 12 nuclear generator.
- Clarified that solar panels cannot supply power during the lunar night because sunlight is unavailable.
- Corrected the Apollo 15 Heat Flow Experiment description: the second probe could not reach the bottom of its hole because a drill-stem section was damaged.
- Updated the matching quiz questions and clues, and added direct NASA reference links to the website's Sources section.
- For the Power Unit and Heat Flow Experiment, the Read to Me control uses the updated browser narration instead of the older recorded read-aloud clip. Other audio clips are unchanged.


## Update 12: supplied narration + featured timeline
- Replaced the home-page video placeholder and upload control with the interactive mission timeline.
- Moved the timeline renderer to the home-page feature area; the Timeline navigation still opens the comparison table.
- Integrated the 14 supplied WAV narration clips (short greeting + full read-aloud for all seven machines).
- Updated the audio player to load WAV files from the website/audio folder.
