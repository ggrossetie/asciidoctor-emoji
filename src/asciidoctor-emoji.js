const twemojiMap = require('./twemoji-map')

function emojiInlineMacro () {
  const self = this
  self.named('emoji')
  self.positionalAttributes('size')

  const defaultSize = '24px'
  const sizeMap = { '1x': '17px', lg: defaultSize, '2x': '34px', '3x': '50px', '4x': '68px', '5x': '85px' }

  self.process(function (parent, target, attrs) {
    const sizeAttr = attrs.size
    let size
    if (sizeAttr && sizeAttr.trim().endsWith('px')) {
      size = sizeAttr
    } else if (sizeAttr && sizeMap[sizeAttr]) {
      size = sizeMap[sizeAttr]
    } else {
      size = defaultSize
    }
    const emojiUnicode = twemojiMap[target]
    if (emojiUnicode) {
      image_src = parent.getImageUri(`https://twemoji.maxcdn.com/2/svg/${emojiUnicode}.svg`)
      return `<img class="emoji" draggable="false" height="${size}" width="${size}" src="${image_src}" />`
    }
    console.warn(`Skipping emoji inline macro. ${target} not found`)
    return `[emoji ${target} not found]`
  })
}

module.exports.register = function register (registry) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.inlineMacro(emojiInlineMacro)
    })
  } else if (typeof registry.block === 'function') {
    registry.inlineMacro(emojiInlineMacro)
  }
  return registry
}
