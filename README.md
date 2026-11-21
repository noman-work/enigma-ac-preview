# Enigma Air Conditioning — Homepage Design Concepts (Stage 1)

Three independent HTML/CSS/JS homepage concepts for client approval. After the client picks one, that direction will be rebuilt in **WordPress + Kadence** (Stage 2). These files are visual prototypes, not the production site.

```
enigma-air-conditioning/
├── index.html                         Design selection page (links to all three)
├── option-1-commercial-authority/     Concept 1 — Montserrat, black / galvanised grey / hi-vis yellow
├── option-2-modern-balanced/          Concept 2 — Poppins, slate / pale blue-grey / gauge blue
├── option-3-project-led/              Concept 3 — Montserrat, white / cool grey / gauge red
├── assets/
│   ├── images/    Client photos, resized to WebP at 640 / 1200 / 1600 px wide
│   ├── logo/      Logo with transparent background (black + white, full + mark-only)
│   └── fonts/     Empty — fonts currently load from Google Fonts (see below)
└── README.md
```

No build step, framework or library is used.

## Preview locally

From inside the `enigma-air-conditioning` folder:

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765/>. Opening `index.html` directly from Finder also works, but a local server matches how the pages will behave once hosted.

## Deploy for the client

Upload the **whole `enigma-air-conditioning` folder** to any static host (Netlify Drop, Vercel, Cloudflare Pages, GitHub Pages or an FTP subfolder). Each concept is then available at its own link:

- `https://your-preview-host/` — selection page
- `https://your-preview-host/option-1-commercial-authority/`
- `https://your-preview-host/option-2-modern-balanced/`
- `https://your-preview-host/option-3-project-led/`

**Sharing one concept on its own:** each option folder only depends on the shared `assets/` folder (referenced as `../assets/`). To host a single option separately, upload that option folder together with `assets/` next to it, keeping the same structure.

All pages include `<meta name="robots" content="noindex, nofollow">` so preview links are not indexed. Remove this in the production build only.

## Fill in client details

Phone and email are set in one place per concept, at the top of each `script.js`:

```js
var SITE = {
  phoneDisplay: '',   // e.g. '01234 567890'
  phoneTel: '',       // e.g. '+441234567890'
  email: ''           // e.g. 'info@enigmaairconditioning.co.uk'
};
```

While `phoneTel` is empty, Call Now buttons show a short "number not added yet" message instead of dialling. Once filled in, every Call Now and phone link uses a proper `tel:` link, and the number appears in the header and footer. Email links stay hidden until `email` is set.

Things still to confirm are marked with `<!-- PROTOTYPE: ... -->` comments in each `index.html`, not shown on the page.

## What is real and what is a placeholder

| Item | Status |
|---|---|
| Photographs | Client-supplied. Captions are generic and need client approval before publishing. |
| School, nursery and commercial kitchen images | **None shown.** These sections use Enigma's own site photos (captioned truthfully) or text only. If no project photos arrive, source from Depositphotos: a bright UK classroom with a wall or cassette unit and no identifiable pupils; a commercial kitchen with extraction canopy; a nursery room with a high wall-mounted unit. |
| F-Gas Qualified · REFCOM Registered | Shown as requested by the client, with a link to the REFCOM website. **Verify** the engineer certificate and company registration, then add the registration number. |
| Customer reviews | **Section left out** until genuine reviews are supplied. An HTML comment marks where it goes. |
| Coverage towns / boroughs | Kent and London only, until confirmed. |
| Phone / email | **Not supplied** — see "Fill in client details". |
| Logo | Supplied logo reads "ENIGMA — Experimental Engineering". Confirm the public brand name and whether an air-conditioning version exists. |

## Design clean-up (AI-slop review)

The concepts were reviewed against Paralect's list of signs of AI-generated design and revised:

- Removed the small uppercase labels above headings, decorative 01/02/03 numbering (kept only for the real 3-step process), dot badges and pill labels.
- Removed coloured edge stripes, gradient overlays on photos, hatched placeholder patterns and hover zoom effects.
- Removed empty image frames and placeholder review cards; sections without real material are left out or use text.
- Credentials appear once in the hero and once with a REFCOM link, instead of 4 times.
- Option 2's labelled VRF diagram was replaced with real photos of outdoor units, pipework and commissioning.
- Buttons, photos and inputs have different shapes, rather than one radius on everything.
- Option 1 (cream and copper) and Option 3 (near-black with one bright accent) were moved off common AI colour schemes. Each accent now has one job: it marks the quote action.
- Copy uses digits (1, 3) and plain verbs; secondary text meets the 4.5:1 contrast minimum (most is above 6:1).

## Quote form

- Section ID `#quote-form`; every Get a Quote button scrolls to it smoothly (instant when the visitor prefers reduced motion), and the heading receives focus for keyboard and screen-reader users.
- Fields: name, phone, email, postcode/location, property type, service required, project description.
- Front-end validation with inline, accessible error messages.
- On success a demo message appears that clearly states **nothing has been sent**.
- **Stage 2:** rebuild with a Kadence Form (or equivalent) block, set the notification recipient, add spam protection (e.g. Turnstile/reCAPTCHA or honeypot), link the Privacy Policy and test delivery.

## Fonts

Roboto (body), Montserrat (concepts 1 and 3) and Poppins (concept 2) load from Google Fonts. For production, self-host the chosen family (WOFF2 in `assets/fonts/`, or Kadence's local Google Fonts option) to avoid third-party requests.

## Images

Originals are in `Client Given Things/Images For Wesbite/`. Selected photos were rotated per EXIF, resized and saved as WebP (quality 76) with `srcset` and `sizes`, so phones download the 640 px version. The hero image is preloaded; everything below the fold is lazy-loaded. Duplicate photos in the supplied folder were skipped.

## Accessibility and quality checks done

- Semantic landmarks, one `h1` per page, logical heading order
- Skip link, visible focus states, keyboard-operable menu (Esc closes)
- Labels on every field; errors linked with `aria-describedby` and `aria-invalid`
- `prefers-reduced-motion` respected for smooth scrolling, hovers and transitions
- Mobile action bar (Get a Quote / Call Now) hides when the form is on screen so it never covers fields
- No horizontal overflow at 375, 768 and 1440 px; no console errors

## Stage 2 notes for the Kadence build

- Build the chosen concept with Kadence Row Layout, Advanced Heading, Image and Form blocks; save repeated sections (trust strip, CTA row, quote form) as Kadence patterns.
- Keep the SEO text block as native editable content on each page (the three concepts show it as a black section, a white section and a stone section; confirm the client's preference from their screenshot).
- Add LocalBusiness / HVACBusiness structured data only with verified details. Never add review ratings unless they come from a genuine source.
- Do not change live DNS or nameservers until the Cloudways origin is ready.
