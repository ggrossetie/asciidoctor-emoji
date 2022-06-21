# :rocket: Asciidoctor Emoji Extension

[![Build](https://github.com/Mogztter/asciidoctor-emoji/actions/workflows/build.yml/badge.svg)](https://github.com/Mogztter/asciidoctor-emoji/actions/workflows/build.yml)
[![npm version](https://img.shields.io/npm/v/asciidoctor-emoji)](https://www.npmjs.com/package/asciidoctor-emoji)

An extension for [Asciidoctor.js](https://github.com/asciidoctor/asciidoctor.js) that turns `emoji:heart[]` into :heart: !

## Install

### Node.js

Install the dependencies:

    $ npm i @asciidoctor/core asciidoctor-emoji

Create a file named `emoji.js` with following content and run it:

```javascript
const asciidoctor = require('@asciidoctor/core')()
const emoji = require('asciidoctor-emoji')

const input = 'I emoji:heart[1x] Asciidoctor.js!'

emoji.register(asciidoctor.Extensions)
console.log(asciidoctor.convert(input)) // <1>

const registry = asciidoctor.Extensions.create()
emoji.register(registry)
console.log(asciidoctor.convert(input, {'extension_registry': registry})) // <2>
```
<1> Register the extension in the global registry   
<2> Register the extension in a dedicated registry

### Browser

Install the dependencies:

    $ npm i @asciidoctor/core asciidoctor-emoji

Create a file named `emoji.html` with the following content and open it in your browser:

```html
<html>
  <head>
    <script src="node_modules/@asciidoctor/core/dist/browser/asciidoctor.js"></script>
    <script src="node_modules/asciidoctor-emoji/dist/browser/asciidoctor-emoji.js"></script>
  </head>
  <body>
    <div id="content"></div>
    <script>
      var input = 'I emoji:heart[1x] Asciidoctor.js!'

      var asciidoctor = Asciidoctor()
      var emoji = AsciidoctorEmoji

      const registry = asciidoctor.Extensions.create()
      emoji.register(registry)
      var result = asciidoctor.convert(input, {'extension_registry': registry})
      document.getElementById('content').innerHTML = result
    </script>
  </body>
</html>
```
<1> Register the extension in the global registry   
<2> Register the extension in a dedicated registry

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

