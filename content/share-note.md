---
title: Share Note (Obsidian Plugin)
type: source-summary
created: 2026-04-13
updated: 2026-04-13
sources:
  - "[[raw/alangraingershare-note Instantly share an Obsidian note with the full theme exactly like you see in your vault. Data is shared encrypted by default, and only you and the person you send it to have the key.]]"
tags:
  - obsidian
  - encryption
  - tools
share: true
---
# Share Note (Obsidian Plugin)

An [[obsidian-plugins|Obsidian plugin]] by Alan Grainger for instantly sharing/publishing notes to the web. Notes render with your full theme and are encrypted by default using [[url-fragment-encryption|url-fragment-encryption]].

- **Repo:** [alangrainger/share-note](https://github.com/alangrainger/share-note)
- **Stats:** 630 stars, MIT license, TypeScript
- **Server:** `note.sx` (closed-source, no self-hosting)

## How It Works

The plugin is not a markdown publisher — it captures the fully rendered DOM from Obsidian's reading mode and reconstructs a standalone HTML page.

### The Share Flow

1. **Switch to reading mode** — forces the note into preview mode to access the rendered HTML
2. **Capture the DOM** — grabs every rendered section from Obsidian's preview renderer, polls until all sections are rendered (including lazy-loaded ones), combines into HTML
3. **Capture all CSS** — collects every CSS rule from every loaded stylesheet (theme, snippets, plugins), strips `@media print` rules, minifies with `csso`
4. **Process media** — finds all `<img>` and `<video>` elements, fetches content locally, hashes with SHA-1, queues for upload. Excalidraw drawings are converted to SVG via the Excalidraw plugin API
5. **Encrypt** — AES-256-GCM via Web Crypto API (see [[url-fragment-encryption|url-fragment-encryption]])
6. **Upload to `api.note.sx`** — sends encrypted HTML + template. Auth uses UID + HMAC (SHA-256 of nonce + API key)
7. **Store link in frontmatter** — adds `share_link` and `share_updated` properties for stable re-sharing

### Clever Implementation Details

**CSS asset pipeline** — Parses through every CSS rule, finds embedded assets (data URIs for fonts, local font files), determines type via MIME whitelist and magic byte detection (`FileTypes.ts`), uploads each separately, then rewrites all `url()` references to point to uploaded versions. Custom fonts work on the shared page.

**Lazy rendering workaround** — Obsidian doesn't render all sections at once for long notes. The plugin polls `renderer.sections` with a heuristic: if 4+ of the last 7 sections have content, it considers the note fully rendered. Pragmatic hack around an undocumented async rendering pipeline.

**Callout icon extraction** — Obsidian callout icons are defined as CSS custom properties (`--callout-icon`), not in the DOM. The plugin searches through CSS rules to find the icon name per callout type, then injects Lucide SVG placeholders.

**Frontmatter property hydration** — Obsidian's rendered frontmatter properties are empty DOM shells. The plugin reads `data-property-key` from the DOM, looks up actual values in `metadataCache`, and manually populates the input elements.

**Batch dedup before upload** — The upload queue sends all file hashes to the server in a single `check-files` request. The server responds with which ones it already has (with URLs). Only missing files get uploaded, in parallel.

**Internal link resolution** — Checks if any `[[wikilink]]` targets are also shared (by checking their frontmatter for `share_link`). If so, rewrites the internal link to point to the other note's public URL, creating a mini interconnected web of shared notes.

**Idempotent re-sharing** — Filename and encryption key are stored in frontmatter after first share. Re-sharing reuses both, so the URL stays stable across updates.

## Encryption

Uses AES-256-GCM via the Web Crypto API:

- Key generated via PBKDF2 (100,000 iterations, SHA-256) from 64 random bytes
- Content split into 2KB chunks, each encrypted with a deterministic IV derived from chunk index
- Key is base64-encoded and appended to the URL as a fragment (`#key`)

See [[url-fragment-encryption|url-fragment-encryption]] for why this works.

## Auth

No account required. API key obtained via Cloudflare Turnstile (bot check), sent back to Obsidian via a custom URI handler (`obsidian://share-note`). No email or personal data needed.

## Limitations

- **Closed-source backend** — `note.sx` is hosted by the author with no self-hosting option. All shared links depend on his infrastructure
- **Trust-dependent encryption** — the server serves the JavaScript that decrypts. A compromised server could serve modified JS that exfiltrates keys
- **Attachments not encrypted** — only note text content is encrypted, images/media are stored unencrypted
- **No offline/local option** — requires the `note.sx` server

## Alternatives

- **Obsidian Publish** — official, paid ($8/mo), full site publishing
- **Quartz / MkDocs** — self-hosted static site generators from markdown
- **Digital Garden plugin** — free, publish to your own GitHub Pages

## See Also

- [[url-fragment-encryption|url-fragment-encryption]]
- [[obsidian-plugins|obsidian-plugins]]
