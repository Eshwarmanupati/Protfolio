# Manupati Eshwar — Portfolio

Personal portfolio of **Manupati Eshwar**, final year B.Tech Computer Engineering student at
SR University, Warangal (2027 batch). Built for placement season: fast, responsive and
hand-written in plain HTML, CSS and JavaScript — no frameworks, no build step.

**Live:** _add your deployment URL here_

---

## Highlights

- **Recruiter-first hero** — availability, target roles, graduation year and key metrics visible without scrolling
- **Dark / light themes** — follows the system preference, remembers the visitor's choice
- **Motion throughout** — character-by-character name reveal, typed roles, scroll reveals, count-ups, animated DSA rings, magnetic buttons, 3D card tilt, spotlight hover, particle field
- **Sections** — About, Experience, Skills, Projects (with filters), DSA, Certifications, Education, Contact
- **Accessible** — skip link, keyboard focus styles, ARIA labels, and a full `prefers-reduced-motion` fallback
- **SEO ready** — Open Graph tags plus JSON-LD `Person` structured data
- **Zero dependencies** — three files, ~100 KB total

## Stack

HTML5 · CSS3 (custom properties, grid, backdrop filters) · Vanilla JavaScript (IntersectionObserver, Canvas 2D)

## Run locally

```bash
git clone https://github.com/Eshwarmanupati/Protfolio.git
cd Protfolio
python3 -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` directly in a browser also works.

## Project structure

```
index.html   — markup and content
style.css    — design tokens, components, responsive rules
script.js    — theme, animations, project rendering, contact form
```

## Editing content

| What to change | Where |
| --- | --- |
| Projects | `PROJECTS` array in `script.js` |
| Typed roles in the hero | `roles` array in `initTyped()` in `script.js` |
| Stats, certifications, education | matching section in `index.html` |
| Colours, spacing, radii | `:root` and `[data-theme="light"]` in `style.css` |

## Contact

- Email — eshwarmanupati@gmail.com
- LinkedIn — [manupati-eshwar](https://www.linkedin.com/in/manupati-eshwar-384b6b22a/)
- GitHub — [Eshwarmanupati](https://github.com/Eshwarmanupati)
- LeetCode — [Eshwar20](https://leetcode.com/u/Eshwar20/)
