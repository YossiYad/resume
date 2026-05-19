# Yossi Yadgar — Resume

Interactive scroll-driven CV. A single video plays forward and backward as you scroll, with text blocks fading in over it. EN/HE language toggle in the top bar.

Live: https://yossiyad.github.io/resume/

## Updating content

Everything content-related lives in **[`config/scene.config.js`](config/scene.config.js)**. No component code needs to change.

### Swap the video

1. Drop the new file into `videos/` (e.g. `videos/hero.mp4`).
2. Edit `config/scene.config.js` and change `video.src`.
3. Update `video.duration` (seconds — auto-corrected on load, but a close value avoids a flash).

### Edit the text blocks

Each block in `textBlocks` has `start` and `end` as **percentages of scroll progress** (0–100), so timing survives a video swap. Every block has both `en` and `he` strings.

## Stack

Plain HTML / CSS, React 18 + Babel-standalone from a CDN — no build step. Deployed via GitHub Pages from `main`.

## Files

```
index.html             entry point + all styles
config/scene.config.js content (video src, text blocks)
scene.jsx              scroll → video time + text-block rendering
app.jsx                topbar + language toggle + mounts the scene
videos/finish.mp4      hero video
```
