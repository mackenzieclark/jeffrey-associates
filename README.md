# Jeffrey Associates

A browser extension that highlights individuals named in the Epstein files as associates of Jeffrey Epstein. Highlighted accounts appear in **amber** on supported social networks.

Forked from [Shinigami Eyes](https://shinigami-eyes.github.io/).

---

## How it works

The extension watches for social media profile links as you browse. If a link points to an account belonging to a named Epstein associate, the link text is colored amber (`#C8860A`). The list of associates is encoded in a [bloom filter](https://en.wikipedia.org/wiki/Bloom_filter) — a compact binary data structure that allows fast membership checks without storing names in plain text.

Supported platforms: Twitter/X, Facebook, YouTube, Reddit, Bluesky, Mastodon, Threads, Medium, Tumblr, Wikipedia, RationalWiki, and major search engines (Google, Bing, DuckDuckGo).

---

## Data

The list of associates is maintained in `data/associates.txt` — one social media identifier per line, in the format `platform.com/handle`. Examples:

```
twitter.com/realdonaldtrump
facebook.com/donaldtrump
youtube.com/@donaldtrump
```

After editing the list, regenerate the bloom filter (see Build below).

---

## Build

Requires [Node.js](https://nodejs.org/) and [TypeScript](https://www.typescriptlang.org/).

```bash
# Install TypeScript globally if not already installed
npm install -g typescript

# Compile TypeScript source files
cd extension && tsc && cd ..

# Generate the bloom filter data file from the associates list
node import-data.js
```

The `import-data.js` script reads `data/associates.txt` and writes the binary bloom filter to `extension/data/associate.dat`.

---

## Installing the extension

**Firefox:**
1. Go to `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select `extension/manifest.json`

**Chromium-based browsers:**
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` directory

---

## Changes from Shinigami Eyes

This fork repurposes the extension for a single purpose: identifying named Epstein associates. The following changes were made:

- **Single category**: The original two-category system (transphobic / trans-friendly) is replaced with one category: `associate` (highlighted in amber).
- **No user submission**: The crowdsourcing pipeline has been removed — no data is sent to any server. The list is centrally maintained in `data/associates.txt`.
- **No consent dialog**: The guidelines/consent page is simplified to an informational page only.
- **No context menu marking**: Right-click "Mark as" menu items are removed. The context menu retains only Settings and Help.
- **Renamed internals**: CSS variables, class names, TypeScript types, and storage keys updated throughout.
- **Simplified bloom filter**: One bloom filter file (`associate.dat`) replaces the original two (`transphobic.dat`, `t-friendly.dat`).

---

## License

See [LICENSE](LICENSE).
