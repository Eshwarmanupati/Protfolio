# Manupati Eshwar — Portfolio

Personal portfolio of **Manupati Eshwar**, final year B.Tech Computer Engineering student at
SR University, Warangal (2027 batch), currently working remotely as a **Manual Test Engineer &
Developer** at Agiledigest Consulting Private Limited. Built for placement season: fast,
responsive and hand-written in plain HTML, CSS and JavaScript — no frameworks, no build step.

**Live:** _add your deployment URL here_

---

## Pages

| Page | What it covers |
| --- | --- |
| `index.html` | Hero, recruiter snapshot, current role summary, key numbers, links into every other page |
| `about.html` | The story, how I work, education, five certifications |
| `experience.html` | The Agiledigest internship in full, plus the timeline of earlier work |
| `projects.html` | Flagship project, filterable grid of six applications, how each one gets built |
| `skills.html` | Toolkit by area, honest proficiency meters, DSA breakdown and activity grid |
| `contact.html` | Every contact channel, a message form, and quick answers for recruiters |

All six pages share `style.css` and `script.js`. The navigation and footer markup is repeated in
each page on purpose — it keeps the site dependency-free and correct with JavaScript disabled.
If you change a nav link, change it in all six files.

## Highlights

- **Recruiter-first hero** — availability, current role, target roles, graduation year and key metrics visible without scrolling
- **Multi-page with animated transitions** — a curtain wipe closes over the page before navigating and retracts on arrival; it is CSS-driven, so it still clears itself if JavaScript fails
- **Dark / light themes** — follows the system preference, remembers the visitor's choice
- **Motion throughout** — character-by-character name reveal, word-by-word masked headings, typed roles, scroll reveals, count-ups, animated DSA rings, proficiency meters, parallax page numbers, magnetic buttons, 3D card tilt, spotlight hover, particle field
- **Accessible** — skip link, keyboard focus styles, ARIA labels, and a full `prefers-reduced-motion` fallback that disables every animation
- **SEO ready** — per-page titles and descriptions, Open Graph tags, JSON-LD `Person` data on the home page
- **Zero dependencies** — six pages plus one stylesheet and one script

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

## Contact

- Email — eshwarmanupati@gmail.com
- LinkedIn — [manupati-eshwar](https://www.linkedin.com/in/manupati-eshwar-384b6b22a/)
- GitHub — [Eshwarmanupati](https://github.com/Eshwarmanupati)
- LeetCode — [Eshwar20](https://leetcode.com/u/Eshwar20/)
