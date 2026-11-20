# brandy

A pure **Sass** theme framework: design tokens, a CSS-only dark mode, and
component classes. It ships `.scss` sources only — **no JavaScript, no
pre-built CSS** — so it can be consumed by any static site or platform
(Eleventy/njk, Ghost/Handlebars, plain HTML) that can compile Sass.

## Layout

```
scss/
  brandy.scss      # entry point — @use this from a consumer
  _palette.scss    # colors (light + dark derivations), all !default
  _type.scss       # fonts and font sizes, all !default
  _space.scss      # spacing scale and column width, all !default
  _tokens.scss     # @use palette/type/space as * (internal convenience)
  _theme.scss      # emits CSS custom properties: light, prefers-color-scheme, [data-theme]
  _base.scss       # reset, typography, links, header/main/footer layout
  _nav.scss        # .header-nav, .brand, .theme-toggle, post-nav sidebar/mobile
  _post.scss       # .post article styles
  _post-list.scss  # .post-list / .post-entry index styles
  _tags.scss       # .tag / .post-tags
  _lightbox.scss   # .lightbox-overlay
examples/
  sample.scss      # consumer entry example
  sample.html      # demo page using only brandy classes
  compile.ts       # bun run check — compiles the sample and asserts key output
```

## Usage

Add brandy as a git submodule, then point Sass at `scss/`:

```bash
git submodule add https://github.com/arijitdasgupta/brandy.git theme/brandy
```

CLI:

```bash
sass --load-path=theme/brandy/scss src/style.scss dist/style.css
```

JS API (what twssg does):

```ts
import * as sass from "sass";
sass.compile("theme/scss/style.scss", {
  loadPaths: ["theme/brandy/scss", "theme/scss"],
});
```

Consumer entry `style.scss`:

```scss
@use "brandy"; // resolves via the load path to theme/brandy/scss/brandy.scss
```

### Overriding tokens

All token variables are `!default`. Configure them before loading brandy:

```scss
@use "palette" with ($paper: #faf9f6, $cobalt-blue: #0b3d91);
@use "space" with ($column-width: 40em);
@use "brandy";
```

## Dark mode contract (no JS required)

`scss/_theme.scss` emits three layers, in increasing priority:

1. `:root` — light theme custom properties
2. `@media (prefers-color-scheme: dark)` — automatic dark mode with zero JS
3. `[data-theme="dark"]` / `[data-theme="light"]` on `<html>` — explicit override

So a consumer without any JS still gets dark mode from the OS setting. If the
consumer wants a manual toggle, the only JS needed is one that flips the
`data-theme` attribute on `<html>` (and optionally persists it) — brandy
styles the `.theme-toggle` button but ships no script.

## Component classes

`header.header > .header-inner > nav.header-nav (.brand, .plain-link)`,
`.theme-toggle`, `main`, `article.post` (`.post-content`, `.post-tags .tag`),
`.post-list .post-entry`, `.post-nav-desktop`/`.post-nav-mobile`,
`.lightbox-overlay`. See `examples/sample.html`.

## Development

```bash
bun install
bun run check     # compiles examples/sample.scss -> examples/sample.css and asserts output
```

## Consumers

- `twssg` (git submodule at `theme/brandy`) — travel blog SSG
- `dazgupta.com` (git submodule at `src/styles/brandy`) — personal site
- a Ghost theme (planned) — submodule at `assets/scss/brandy`, compiled to
  `assets/css/style.css` with a plain `sass` npm script

Update the theme in one place, then in each consumer:

```bash
git -C <submodule-path> pull
git add <submodule-path>
```
