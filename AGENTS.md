# Base44 sandbox notes

This project is a **build-free static lesson site**: `index.html`, `app.js`, `data.js`,
`styles.css` and 40 slide images (`slide-01.jpg` … `slide-40.jpg`) in the repo root.
There is no package manager, build step, backend, database or external API — so the
sandbox needs **no credentials**, and there is no `.env` to fill in.

All five tabs (Slides, Quiz, Completar, Missões, Speaking) are client-side sections of
`index.html`; there is no server-side routing and no API. Lesson content lives only in
`data.js` (`window.AULA`), so editing a question or mission means editing that one file.

## Running the preview

```bash
docker compose -f docker-compose.base44.yml up -d   # app on host port 3000
```

One service, `web`, runs `node:22` with the repo bind-mounted at `/app` and starts
`.base44/dev-server.mjs`, a small sandbox-only static server (not part of the lesson app):

- serves the clone's files raw with `Cache-Control: no-store`, so edits appear with no build;
- injects a tiny reload script into HTML and pushes a browser reload over `/__dev_reload`
  (SSE) whenever a file changes — 1s polling, which survives bind mounts where inotify
  events may not reach the container;
- `BASE44_PREVIEW_MODE` is passed through as a bare compose entry for sandbox-only
  conditionals; the app code does not read it today.

## Verifying it works

- `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/` → `200` with the lesson HTML.
- Slides tab: 40 `<figure class="page">` nodes with captions; a misnamed image shows as a broken image.
- Quiz: shuffled at load (`startQuiz`), so never assume an option index in a test — the correct
  option always ends up with class `right`, the picked one with `right` or `wrong`.
- Completar: typed answers are compared by `matches()`/`norm()` in `app.js`; `—` means "no article".
- Missões: clicking a tile opens the 30s task card; awarding a point writes to the scoreboard.
- Speaking records audio with `MediaRecorder` — needs microphone permission, and the
  recordings live only in page memory (they vanish on reload).
- `index.html` requests `app.js?v=2`; the dev server sends `no-store`, so a plain reload
  always picks up edits.
