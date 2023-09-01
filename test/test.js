/* global describe it */
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)

const asciidoctorEmoji = require('../src/asciidoctor-emoji.js')
const asciidoctor = require('@asciidoctor/core')()

describe('Registration', () => {
  it('should register the extension', () => {
    const registry = asciidoctor.Extensions.create()
    expect(registry['$inline_macros?']()).to.be.false()
    asciidoctorEmoji.register(registry)
    expect(registry['$inline_macros?']()).to.be.true()
    expect(registry['$registered_for_inline_macro?']('emoji')).to.be.an('object')
  })
})

describe('Conversion', () => {
  describe('When extension is not registered', () => {
    it('should not convert an existing emoji', () => {
      const input = 'emoji:smile[]'
      const html = asciidoctor.convert(input)
      expect(html).to.contain('emoji:smile[]')
    })
    it('should not convert an non existing emoji', () => {
      const input = 'emoji:ooops[]'
      const html = asciidoctor.convert(input)
      expect(html).to.contain('emoji:ooops[]')
    })
  })
  describe('When extension is registered', () => {
    it('should convert an existing emoji into an image', () => {
      const input = 'emoji:smile[]'
      const registry = asciidoctor.Extensions.create()
      asciidoctorEmoji.register(registry)
      const html = asciidoctor.convert(input, { extension_registry: registry })
      expect(html).to.contain('<span class="emoji"><img src="https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f604.svg" alt="smile" width="24px" height="24px"></span>')
    })
    it('should return an error message if the emoji does not exist', () => {
      const input = 'emoji:ooops[]'
      const registry = asciidoctor.Extensions.create()
      asciidoctorEmoji.register(registry)
      const html = asciidoctor.convert(input, { extension_registry: registry })
      expect(html).to.contain('[emoji ooops not found]')
    })
  })
  it('should convert an existing emoji into an image with the size 2x (34px)', () => {
    const input = 'emoji:santa-skin-tone-6[2x]'
    const registry = asciidoctor.Extensions.create()
    asciidoctorEmoji.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain('<span class="emoji"><img src="https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f385-1f3ff.svg" alt="santa-skin-tone-6" width="34px" height="34px"></span>')
  })
  it('should convert an existing emoji into an image with the size 4x (68px)', () => {
    const input = 'emoji:beetle[4x]'
    const registry = asciidoctor.Extensions.create()
    asciidoctorEmoji.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain('<span class="emoji"><img src="https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f41e.svg" alt="beetle" width="68px" height="68px"></span>')
  })
  it('should convert an existing emoji into an image with the size in pixel (42px)', () => {
    const input = 'emoji:penguin[42px]'
    const registry = asciidoctor.Extensions.create()
    asciidoctorEmoji.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain('<span class="emoji"><img src="https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f427.svg" alt="penguin" width="42px" height="42px"></span>')
  })
  it('should convert an existing emoji into an inline image', () => {
    const input = 'emoji:black_circle[]'
    const registry = asciidoctor.Extensions.create()
    asciidoctorEmoji.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry, safe: 'safe', attributes: { 'data-uri': '', 'allow-uri-read': '' } })
    expect(html).to.contain('<span class="emoji"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+PGNpcmNsZSBmaWxsPSIjMzEzNzNEIiBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiLz48L3N2Zz4=" alt="black_circle" width="24px" height="24px"></span>')
  })
})
