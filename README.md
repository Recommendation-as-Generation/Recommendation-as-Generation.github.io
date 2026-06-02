# Recommendation Timeline Demo

A static GitHub Pages-ready demo for sequential personalized recommendations.

Each user owns one folder under `assets/users/`. Files inside a folder are sorted by filename and rendered as a horizontal timeline:

- Images (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`) are shown as browsing interests.
- Videos (`.mp4`, `.webm`, `.mov`, `.m4v`) are shown as generated personalized recommendations.
- Multiple user folders are rendered vertically as separate rows with distinct low-saturation colors.

## Folder layout

```text
assets/
  users/
    User1/
      1.png
      2.png
      3.png
      4.mp4
    User2/
      1.png
      2.mp4
```

## Update the demo after changing assets

Run either command:

```bash
npm run manifest
```

```bash
node scripts/generate-manifest.js
```

This regenerates `manifest.json`, so `index.html` does not need manual edits when you add, remove, rename, or reorder user assets.

## Preview locally

```bash
npm run manifest
npm run start
```

or:

```bash
node scripts/generate-manifest.js
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Push the repository to GitHub, set the default branch to `main`, and enable GitHub Pages with **GitHub Actions** as the source. The included workflow regenerates `manifest.json` during deployment, so new asset folders are picked up automatically on push.
