/* global describe it */
const chai = require('chai')
const expect = chai.expect

const asciidoctorEmoji = require('../src/asciidoctor-emoji.js')
const asciidoctor = require('asciidoctor.js')()

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
      const input = `emoji:smile[]`
      const html = asciidoctor.convert(input)
      expect(html).to.contain('emoji:smile[]')
    })
    it('should not convert an non existing emoji', () => {
      const input = `emoji:ooops[]`
      const html = asciidoctor.convert(input)
      expect(html).to.contain('emoji:ooops[]')
    })
  })
  describe('When extension is registered', () => {
    it('should convert an existing emoji into an image', () => {
      const input = `emoji:smile[]`
      const registry = asciidoctor.Extensions.create()
      asciidoctorEmoji.register(registry)
      const html = asciidoctor.convert(input, { extension_registry: registry })
      expect(html).to.contain('<img class="emoji" draggable="false" height="24px" width="24px" src="https://twemoji.maxcdn.com/2/svg/1f604.svg" />')
    })
    it('should return an error message if the emoji does not exist', () => {
      const input = `emoji:ooops[]`
      const registry = asciidoctor.Extensions.create()
      asciidoctorEmoji.register(registry)
      const html = asciidoctor.convert(input, { extension_registry: registry })
      expect(html).to.contain('[emoji ooops not found]')
    })
  })
  it('should convert an existing emoji into an image with the size 2x (34px)', () => {
    const input = `emoji:santa-skin-tone-6[2x]`
    const registry = asciidoctor.Extensions.create()
    asciidoctorEmoji.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain('<img class="emoji" draggable="false" height="34px" width="34px" src="https://twemoji.maxcdn.com/2/svg/1f385-1f3ff.svg" />')
  })
  it('should convert an existing emoji into an image with the size 4x (68px)', () => {
    const input = `emoji:beetle[4x]`
    const registry = asciidoctor.Extensions.create()
    asciidoctorEmoji.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain('<img class="emoji" draggable="false" height="68px" width="68px" src="https://twemoji.maxcdn.com/2/svg/1f41e.svg" />')
  })
  it('should convert an existing emoji into an image with the size in pixel (42px)', () => {
    const input = `emoji:penguin[42px]`
    const registry = asciidoctor.Extensions.create()
    asciidoctorEmoji.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain('<img class="emoji" draggable="false" height="42px" width="42px" src="https://twemoji.maxcdn.com/2/svg/1f427.svg" />')
  })
})
