import twemojiMap from './twemoji-map.js'

function emojiInlineMacro() {
  this.named('emoji')
  this.positionalAttributes('size')

  const defaultSize = '24px'
  const sizeMap = { '1x': '17px', lg: defaultSize, '2x': '34px', '3x': '50px', '4x': '68px', '5x': '85px' }

  this.process((parent, target, attrs) => {
    // @asciidoctor/core's inline macro substitution doesn't honor positionalAttributes()
    // (it reads a differently-cased config key), so the attrlist ends up in attrs.text
    // instead of attrs.size. Fall back to it until that's fixed upstream.
    const sizeAttr = attrs.size ?? attrs.text
    let size
    if (sizeAttr?.trim().endsWith('px')) {
      size = sizeAttr
    } else if (sizeAttr && sizeMap[sizeAttr]) {
      size = sizeMap[sizeAttr]
    } else {
      size = defaultSize
    }
    const emojiUnicode = twemojiMap[target]
    if (emojiUnicode) {
      return this.createInline(parent, 'image', '', {
        target: `https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/${emojiUnicode}.svg`,
        type: 'emoji',
        attributes: {
          alt: target,
          height: size,
          width: size,
        },
      })
    }
    console.warn(`Skipping emoji inline macro. ${target} not found`)
    return this.createInline(parent, 'quoted', `[emoji ${target} not found]`, attrs)
  })
}

export function register(registry) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.inlineMacro(emojiInlineMacro)
    })
  } else if (typeof registry.block === 'function') {
    registry.inlineMacro(emojiInlineMacro)
  }
  return registry
}
