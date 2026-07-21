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

## How ?

This extension is using [Twemoji from Twitter](https://blog.twitter.com/developer/en_us/a/2014/open-sourcing-twitter-emoji-for-everyone.html).
The `emoji` inline macro is converted into an `<image>` that points to a remote SVG:


```adoc
emoji:beetle[]
```

```html
<span class="emoji"><img src="https://twemoji.maxcdn.com/2/svg/1f41e.svg" alt="beetle" width="24px" height="24px"></span>
```

<span class="emoji"><img src="https://twemoji.maxcdn.com/2/svg/1f41e.svg" alt="beetle" width="24px" height="24px"></span>

