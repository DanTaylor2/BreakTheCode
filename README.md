# Break the Code

A fast, repeatable **Women in STEM digital careers challenge** for local-government careers fairs.

The activity is designed to take about **2 minutes**. A participant sees an encrypted council-service message, solves the event-themed clue to discover the key `WOMANINSTEM`, then uses the built-in decoder to reveal a fictional local-government service mission.

## Why it is deliberately simple

Careers-fair visitors may only have a few minutes at the stand. This version:

- runs entirely in the browser
- has no login, database, API or AI dependency
- uses no real resident or council data
- randomly rotates fictional council-service messages
- avoids repeating the same mission twice in a row
- includes progressive hints so nobody gets stuck
- has a 2-minute visual timer, but does not lock someone out when time expires
- resets instantly with **New mission**
- can also be reset with the `Escape` key for kiosk use

## Design approach

The interface follows familiar accessible government-service conventions while intentionally **not** presenting itself as GOV.UK.

For a public-sector service that is not part of GOV.UK, current GOV.UK Frontend guidance says to use the Generic header approach and your own organisation's branding rather than the GOV.UK crown/logotype, GDS Transport font or GOV.UK brand colours.

This repo is dependency-free, so the current implementation recreates the relevant interaction and layout conventions in local CSS rather than importing GOV.UK Frontend.

Before using it publicly, replace **Local Government Digital Careers** and the placeholder brand colour with your council's approved name and brand.

## Run locally

No build step is needed.

You can open `index.html` directly in a browser, or serve the directory with any static web server, for example:

```bash
python -m http.server 8000
```

Then browse to `http://localhost:8000`.

## GitHub Pages

Because the site is static, it can be hosted directly with GitHub Pages.

In the repository:

1. Open **Settings**
2. Open **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Select the `main` branch and `/ (root)`
5. Save

GitHub will show the published URL when deployment completes.

## Edit the challenge

The game content is in `app.js`.

### Secret key

```js
const SECRET_KEY = "WOMANINSTEM";
```

### Missions

Edit the `missions` array to add or remove fictional council-service messages.

### Hints

Edit the `hints` array to change how quickly the answer is revealed.

## Files

- `index.html` — page structure and game screens
- `styles.css` — responsive, accessible government-service-inspired styling
- `app.js` — challenge logic, Vigenère encoding, timer, hints and reset behaviour
- `.nojekyll` — keeps GitHub Pages serving the static files directly

## Safety and privacy

This is a fictional educational activity. Do not add real resident information, live system details, credentials, real incident references or other sensitive council information to the challenge data.
