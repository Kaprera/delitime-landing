# DeliTime — landing page

The public marketing page at **delitime.org**. Plain HTML, CSS and JavaScript:
no framework, no dependencies, no build step. Deployed to **Netlify**.

This is deliberately separate from the Next.js console, which lives in its own
repository and deploys to **Render**. The two halves share no build, no runtime
and no session — the only thing crossing between them is the "Sign in" link.

```
delitime/
├── index.html     the page, including an inline SVG icon sprite
├── styles.css     design tokens + every rule the page uses
├── script.js      theme toggle, footer year — both progressive enhancements
├── netlify.toml   publish settings + security headers
├── favicon.ico    same mark as the console
├── robots.txt
└── sitemap.xml
```

## Working on it

There is nothing to install and nothing to compile. Open `index.html`, or
serve the folder if you want correct relative paths:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

Edit the files and reload. That is the whole loop.

## Before you deploy

**Point "Sign in" at the console.** Every `https://app.delitime.org` in
`index.html` is the Render deployment's address: three links — header, hero and
footer — plus one mention in the comment at the top of the file.

```bash
grep -n "app.delitime.org" index.html
```

**Check the contact details.** The demo address (`demo@delitime.org`), the
phone number and the studio credit are written directly into `index.html`,
inside pre-encoded `mailto:` links. They used to come from
`NEXT_PUBLIC_DEMO_EMAIL`; a static site has no environment, so the address
lives in the markup now. If you change it, change it in all six `mailto:`
links. `grep -o "mailto:" index.html | wc -l` should still report 6:
header, hero, closing panel, and three in the footer.

## Netlify

Point Netlify at this repository and let `netlify.toml` do the rest: it
publishes the repository root as-is and runs no build command. That last part
matters — without it Netlify goes looking for a framework to detect and tries
to build something that is not here.

## Two things that will bite you

**The inline theme script is pinned by hash.** `index.html` carries one inline
`<script>` in `<head>`, which reads the stored theme before first paint so a
dark visitor never sees a flash of white. The Content-Security-Policy in
`netlify.toml` allows it by `sha256-` hash rather than `'unsafe-inline'`. Edit
that script and the browser silently refuses to run it. Recompute with:

```bash
python3 -c "import re,hashlib,base64;h=open('index.html').read();\
b=re.search(r'<script>(.*?)</script>',h,re.S).group(1);\
print('sha256-'+base64.b64encode(hashlib.sha256(b.encode()).digest()).decode())"
```

**The palette is stated three times.** Light on `:root`, dark on
`:root[data-theme="dark"]`, and dark again inside
`@media (prefers-color-scheme: dark)` for `:root[data-theme="system"]`. CSS
cannot put a media query inside a selector list, so the two dark copies cannot
share a rule. They are meant to be identical — edit them together.

These tokens are copied from the console's `src/app/globals.css` so a status
pill here is the pill the visitor meets after signing in. When the console's
palette changes, copy it across.
