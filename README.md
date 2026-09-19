# Manupati Eshwar — Portfolio

Personal portfolio of **Manupati Eshwar**, final year B.Tech Computer Engineering student at
SR University, Warangal (2027 batch), currently working remotely as a **Manual Test Engineer &
Developer** at Agiledigest Consulting Private Limited. Built for placement season: fast,
responsive and hand-written in plain HTML, CSS and JavaScript — no frameworks, no build step.

**The angle:** most fresher portfolios say *"here are the things I built."* This one says
**"I build it, then I break it"** — because testing production software every day is the rarer half
of the skill set, and it is the half that makes the first half hold up.

**Live:** https://eshwarmanupati.github.io/Protfolio/

---

## Pages

| Page | What it covers |
| --- | --- |
| `index.html` | Hero, recruiter snapshot, current role summary, key numbers, links into every other page |
| `about.html` | The story, how I work, education, five certifications |
| `experience.html` | The Agiledigest internship in full, plus the timeline of earlier work |
| `projects.html` | Flagship project, filterable grid of six applications, and the bug I found in each of my own builds |
| `quality.html` | The two mindsets, an interactive defect report with live environment capture, the pre-ship checklist |
| `skills.html` | Toolkit by area, honest proficiency meters, DSA breakdown and activity grid |
| `contact.html` | Every contact channel, a message form, and quick answers for recruiters |

All seven pages share `style.css` and `script.js`. The navigation and footer markup is repeated in
each page on purpose — it keeps the site dependency-free and correct with JavaScript disabled.
If you change a nav link, change it in all seven files.

## Highlights

- **Recruiter-first hero** — availability, current role, target roles, graduation year and key metrics visible without scrolling
- **Native cross-document view transitions** — the browser morphs between pages, with the nav, footer and reading rail held in place; direction-aware, so moving right through the nav pushes content left and going back reverses it. Browsers without the API fall back to a JS curtain wipe
- **"How I broke it"** — every project card opens to show what I tried, what failed and how I fixed it
- **Live defect report** — the environment block on the quality page is filled in from the reader's own browser, which is exactly the data a developer needs to reproduce a bug
- **Dark / light themes** — follows the system preference, remembers the visitor's choice
- **Motion throughout** — character-by-character name reveal, word-by-word masked headings, typed roles, scroll reveals, count-ups, animated DSA rings, proficiency meters, parallax page numbers, magnetic buttons, 3D card tilt, spotlight hover, particle field
- **Reading rail** — a slim minimap down the left margin where the "ME" monogram rides your scroll position, leaning and squashing with scroll direction and speed; the dots are clickable section jumps with hover labels
- **Accessible** — skip link, keyboard focus styles, ARIA labels, and a full `prefers-reduced-motion` fallback that disables every animation
- **SEO ready** — per-page titles and descriptions, Open Graph tags, JSON-LD `Person` data on the home page
- **Zero dependencies** — seven pages plus one stylesheet and one script

## Stack

HTML5 · CSS3 (custom properties, grid, backdrop filters) · Vanilla JavaScript (IntersectionObserver, Canvas 2D)

## Run locally

```bash
git clone https://github.com/Eshwarmanupati/Protfolio.git
cd Protfolio
python3 -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` directly in a browser also works.

## Editing content

| What to change | Where |
| --- | --- |
| Projects | `PROJECTS` array in `script.js` |
| Typed roles in the hero | `roles` array in `initTyped()` in `script.js` |
| Current role details | the `.now-card` block in `index.html` and `experience.html` |
| Proficiency bars | `data-pct` on `.meter-fill` in `skills.html` |
| Example defect reports | `TICKETS` array in `script.js` |
| Pre-ship checklist | `CHECKS` array in `script.js` |
| A project's "How I broke it" | the `broke: { found, failed, fixed }` object on that project in `PROJECTS` |
| Reading-rail avatar | `.rail-avatar` in each page — replace the `ME` text with `<img src="assets/avatar.jpg" alt="" />` for a photo |
| A reading-rail dot's label | `data-rail="…"` on that `<section>` |
| Stats, certifications, education | the matching section in `about.html` / `skills.html` |
| Colours, spacing, radii | `:root` and `[data-theme="light"]` in `style.css` |

### Animation hooks

Add one of these attributes to any element and it animates in as it scrolls into view:

| Attribute | Effect |
| --- | --- |
| `data-anim="fade-up"` / `fade-left` / `fade-right` / `zoom` | Directional fades |
| `data-anim="rise"` | Heavier card entrance — lifts and settles |
| `data-anim="blur-in"` / `flip-up` | Focus pull and 3D tilt-up |
| `data-anim="words"` | Splits the heading and slides each word up behind its own baseline |
| `data-anim="chars"` | Per-character reveal (used for the hero name) |
| `data-delay="120"` | Delays that element's reveal, in milliseconds |
| `data-stagger="80"` | On a container: cascades its animated children by that many ms |
| `data-parallax="0.08"` | Drifts the element as the page scrolls |

Avoid `clip-path` for reveals: a fully clipped element reports an empty intersection rect, so
`IntersectionObserver` never fires and the element stays hidden.

### Page transitions

`@view-transition { navigation: auto; }` in `style.css` does the work. `initPageTransitions()`
checks for `CSSViewTransitionRule` — the interface the at-rule exposes, and the honest test for
*cross-document* support rather than the same-document `startViewTransition()` that shipped
earlier. When it is present the JS curtain removes itself so the two never run at once.

Direction comes from `NAV_ORDER` in `script.js`: a click writes `fwd` or `back` to
`sessionStorage`, and a small inline script in each page's `<head>` reads it onto
`<html data-nav-dir>` before the first paint, because by the time `script.js` runs the transition
has already chosen its animation.

### Reading rail

`initReadRail()` builds the rail from whatever sections a page has, so new sections appear on it
automatically. A dot's label comes from `data-rail`, else the section's `.section-kicker` (with any
leading `01 — ` stripped), else its heading. It removes itself on pages with fewer than two
sections or under 600px of scroll, and is hidden below 1240px viewport width — narrower than that
there is no margin for it to sit in without hitting the content.

## Contact

- Email — eshwarmanupati@gmail.com
- LinkedIn — [manupati-eshwar](https://www.linkedin.com/in/manupati-eshwar-384b6b22a/)
- GitHub — [Eshwarmanupati](https://github.com/Eshwarmanupati)
- LeetCode — [Eshwar20](https://leetcode.com/u/Eshwar20/)
