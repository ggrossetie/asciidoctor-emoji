# :rocket: Asciidoctor Emoji Extension

[![Build](https://github.com/ggrossetie/asciidoctor-emoji/actions/workflows/build.yml/badge.svg)](https://github.com/ggrossetie/asciidoctor-emoji/actions/workflows/build.yml)
[![npm version](https://img.shields.io/npm/v/asciidoctor-emoji)](https://www.npmjs.com/package/asciidoctor-emoji)

An extension for [Asciidoctor.js](https://github.com/asciidoctor/asciidoctor.js) that turns `emoji:heart[]` into :heart: !

## Install

### Node.js

Install the dependencies:

    $ npm i @asciidoctor/core asciidoctor-emoji

Requires Node.js 20 or later. Asciidoctor.js's `convert` is asynchronous, so it must be awaited.

Create a file named `emoji.mjs` with following content and run it:

```javascript
import { convert, Extensions } from '@asciidoctor/core'
import { register } from 'asciidoctor-emoji'

const input = 'I emoji:heart[1x] Asciidoctor.js!'

const registry = Extensions.create()
register(registry)
console.log(await convert(input, { extension_registry: registry }))
```

This package is also published as CommonJS. Using `require`:

```javascript
const { convert, Extensions } = require('@asciidoctor/core')
const { register } = require('asciidoctor-emoji')

async function main () {
  const input = 'I emoji:heart[1x] Asciidoctor.js!'

  const registry = Extensions.create()
  register(registry)
  console.log(await convert(input, { extension_registry: registry }))
}

main()
```

### Browser

Install the dependencies:

    $ npm i @asciidoctor/core asciidoctor-emoji

Asciidoctor.js is published as a native ES module, so it must be loaded with `<script type="module">`. Create a file named `emoji.html` with the following content and serve it with a local web server (ES modules aren't loaded from a `file://` URL):

```html
<html>
  <body>
    <div id="content"></div>
    <script type="module">
      import { convert, Extensions } from './node_modules/@asciidoctor/core/build/browser/index.js'
      import { register } from './node_modules/asciidoctor-emoji/src/asciidoctor-emoji.js'

      const input = 'I emoji:heart[1x] Asciidoctor.js!'

      const registry = Extensions.create()
      register(registry)
      const result = await convert(input, { extension_registry: registry })
      document.getElementById('content').innerHTML = result
    </script>
  </body>
</html>
```

A UMD build is also published at `dist/browser/asciidoctor-emoji.js` (exposing a global `AsciidoctorEmoji`) for bundlers or non-module `<script>` usage.

## Usage

Use `emoji:` followed by the name of your emoji (and don't forget the square brackets). For instance `wink`:

```adoc
emoji:wink[]
```

Additionally you can configure the size of an `emoji`.
By default, the size is 24px but you can use one of the following:

* `1x` (17px)
* `lg` (24px)
* `2x` (34px)
* `3x` (50px)
* `4x` (68px)
* `5x` (85px)

If you want a really big :bear:, use:

```adoc
emoji:bear[5x]
```

You can also specify a size in pixel :tada:

```adoc
emoji:tada[42px]
```

If the emoji does not exist, a warning is logged (through Asciidoctor's own logger, including
the source line when the document is processed with `sourcemap: true`) and the macro is left
in place, marked with the `unresolved` role so it can be styled or spotted in the output:

```adoc
emoji:not-an-emoji[]
```

```html
<span class="emoji unresolved">emoji:not-an-emoji[] unresolved</span>
```

## Configuring the image source

By default, emoji are rendered from Discord's `@discordapp/twemoji` fork on jsDelivr (see [How ?](#how-) below).
You can point at a different CDN or emoji set with the `emoji-pattern` document attribute, a URL template
with a placeholder for the emoji:

* `{codepoint}` — the hyphen-joined, lowercase hex Unicode codepoint(s), e.g. `1f604` or `1f1eb-1f1f7` for `flag-fr`
* `{CODEPOINT}` — same, but uppercase, e.g. `1F1EB-1F1F7` for `flag-fr` (needed by, e.g., OpenMoji)
* `{codepoint_underscore}` — same as `{codepoint}`, but underscore-joined, e.g. `1f1eb_1f1f7` for `flag-fr` (needed by, e.g., Google's Noto Emoji CDN)
* `{emoji}` — the actual emoji character(s), percent-encoded, e.g. `%F0%9F%87%AB%F0%9F%87%B7` for `flag-fr`

```adoc
:emoji-pattern: https://cdn.jsdelivr.net/npm/emoji-datasource-twitter@16.0.0/img/twitter/64/{codepoint}.png

emoji:tada[]
```

Other examples:

```adoc
// Facebook emoji set, served from jsDelivr
:emoji-pattern: https://cdn.jsdelivr.net/npm/emoji-datasource-facebook@16.0.0/img/facebook/64/{codepoint}.png

// Official Twemoji CDN
:emoji-pattern: https://twemoji.maxcdn.com/2/svg/{codepoint}.svg

// OpenMoji, served from jsDelivr (requires uppercase codepoints)
:emoji-pattern: https://cdn.jsdelivr.net/npm/openmoji@16.0.0/color/svg/{CODEPOINT}.svg

// Google's Noto Emoji font, served by Google Fonts (requires underscore-joined codepoints)
:emoji-pattern: https://fonts.gstatic.com/s/e/notoemoji/latest/{codepoint_underscore}/512.png

// emoji-cdn (https://github.com/oddmario/emoji-cdn), keyed by the raw emoji character
:emoji-pattern: https://emoji-cdn.mqrio.dev/{emoji}?style=google
```

## Rendering emoji as text with a font

Instead of fetching an image, you can render the emoji as its actual Unicode character and let
the font handle the display (e.g. a system emoji font, or a webfont like Noto Emoji/Twemoji
Mozilla loaded via CSS) by setting the `emojis` document attribute to `font`:

```adoc
:emojis: font

I emoji:heart[] Asciidoctor.js!
```

```html
I <span class="emoji" title="heart" style="font-size:24px">❤</span> Asciidoctor.js!
```

The `size` argument (see above) is applied as a `font-size` instead of `width`/`height`. An
unresolved emoji still logs a warning and renders the same `unresolved`-tagged placeholder
regardless of the `emojis` attribute.

By default, `emojis: font` relies on whatever emoji font is already available to the reader
(the OS/browser's system emoji font). No webfont is bundled or loaded automatically, so there's
no extra network request. If you want consistent rendering across platforms, point the
`emoji-webfont` document attribute at a stylesheet (typically one that declares an `@font-face`,
e.g. [Twemoji Mozilla](https://github.com/mozilla/twemoji-colr) or
[Noto Color Emoji](https://fonts.google.com/noto/specimen/Noto+Color+Emoji)) and it is injected
as a `<link>` in the document `<head>`:

```adoc
:emojis: font
:emoji-webfont: https://example.org/twemoji-mozilla.css

I emoji:heart[] Asciidoctor.js!
```

```html
<link rel="stylesheet" href="https://example.org/twemoji-mozilla.css">
```

`emoji-webfont` only has an effect when `emojis` is set to `font`, and only when converting a
standalone document (it has nowhere to inject a `<link>` in an embedded fragment).

## How ?

This extension is using [Twemoji](https://github.com/discord/twemoji), Discord's actively maintained fork of Twitter's original emoji set.
The `emoji` inline macro is converted into an `<image>` that points to a remote SVG, tagged with the `emoji` role so it can be targeted with CSS:


```adoc
emoji:beetle[]
```

```html
<span class="image emoji"><img src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1fab2.svg" alt="beetle" width="24px" height="24px"></span>
```

<span class="image emoji"><img src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1fab2.svg" alt="beetle" width="24px" height="24px"></span>

