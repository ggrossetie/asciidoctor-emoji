import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { convert, Extensions, MemoryLogger } from '@asciidoctor/core'
import { register } from '../src/asciidoctor-emoji.js'

describe('Registration', () => {
  it('should register the extension', () => {
    const registry = Extensions.create()
    assert.equal(registry.hasInlineMacros(), false)
    register(registry)
    assert.equal(registry.hasInlineMacros(), true)
    assert.ok(registry.registeredForInlineMacro('emoji'))
  })
})

describe('Conversion', () => {
  describe('When extension is not registered', () => {
    it('should not convert an existing emoji', async () => {
      const input = 'emoji:smile[]'
      const html = await convert(input)
      assert.ok(html.includes('emoji:smile[]'))
    })
    it('should not convert an non existing emoji', async () => {
      const input = 'emoji:ooops[]'
      const html = await convert(input)
      assert.ok(html.includes('emoji:ooops[]'))
    })
  })
  describe('When extension is registered', () => {
    it('should convert an existing emoji into an image', async () => {
      const input = 'emoji:smile[]'
      const registry = Extensions.create()
      register(registry)
      const html = await convert(input, { extension_registry: registry })
      assert.ok(
        html.includes(
          '<span class="image emoji"><img src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1f604.svg" alt="smile" width="24px" height="24px"></span>',
        ),
      )
    })
    it('should return an error message if the emoji does not exist', async () => {
      const input = 'emoji:ooops[]'
      const registry = Extensions.create()
      register(registry)
      const html = await convert(input, { extension_registry: registry })
      assert.ok(html.includes('<span class="emoji unresolved">emoji:ooops[] unresolved</span>'))
    })
    it('should log a warning with the source location when the emoji does not exist', async () => {
      const input = 'emoji:ooops[]'
      const registry = Extensions.create()
      register(registry)
      const memoryLogger = MemoryLogger.create()
      await convert(input, {
        extension_registry: registry,
        sourcemap: true,
        logger: memoryLogger,
        attributes: { docfile: 'test.adoc' },
      })
      const messages = memoryLogger.getMessages()
      assert.equal(messages.length, 1)
      assert.equal(messages[0].getSeverity(), 'WARN')
      assert.equal(messages[0].getText(), 'skipping emoji inline macro, ooops not found')
      assert.equal(messages[0].getSourceLocation().getLineNumber(), 1)
    })
  })
  it('should convert an existing emoji into an image with the size 2x (34px)', async () => {
    const input = 'emoji:santa-skin-tone-6[2x]'
    const registry = Extensions.create()
    register(registry)
    const html = await convert(input, { extension_registry: registry })
    assert.ok(
      html.includes(
        '<span class="image emoji"><img src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1f385-1f3ff.svg" alt="santa-skin-tone-6" width="34px" height="34px"></span>',
      ),
    )
  })
  it('should convert an existing emoji into an image with the size 4x (68px)', async () => {
    const input = 'emoji:beetle[4x]'
    const registry = Extensions.create()
    register(registry)
    const html = await convert(input, { extension_registry: registry })
    assert.ok(
      html.includes(
        '<span class="image emoji"><img src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1fab2.svg" alt="beetle" width="68px" height="68px"></span>',
      ),
    )
  })
  it('should convert an existing emoji into an image with the size in pixel (42px)', async () => {
    const input = 'emoji:penguin[42px]'
    const registry = Extensions.create()
    register(registry)
    const html = await convert(input, { extension_registry: registry })
    assert.ok(
      html.includes(
        '<span class="image emoji"><img src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1f427.svg" alt="penguin" width="42px" height="42px"></span>',
      ),
    )
  })
  it('should convert an emoji that was missing from the previous, stale twemoji-map.js', async () => {
    const input = 'emoji:avocado[]'
    const registry = Extensions.create()
    register(registry)
    const html = await convert(input, { extension_registry: registry })
    assert.ok(
      html.includes(
        '<span class="image emoji"><img src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1f951.svg" alt="avocado" width="24px" height="24px"></span>',
      ),
    )
  })
  it('should convert an emoji alias to the same image as its primary short name', async () => {
    const registry = Extensions.create()
    register(registry)
    const [primary, alias] = await Promise.all([
      convert('emoji:+1[]', { extension_registry: registry }),
      convert('emoji:thumbsup[]', { extension_registry: registry }),
    ])
    assert.ok(primary.includes('src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1f44d.svg"'))
    assert.ok(alias.includes('src="https://cdn.jsdelivr.net/npm/@discordapp/twemoji@16.0.1/dist/svg/1f44d.svg"'))
  })
  it('should convert an existing emoji into an inline image', async () => {
    const input = 'emoji:black_circle[]'
    const registry = Extensions.create()
    register(registry)
    const html = await convert(input, {
      extension_registry: registry,
      safe: 'safe',
      attributes: { 'data-uri': '', 'allow-uri-read': '' },
    })
    assert.ok(
      html.includes(
        '<span class="image emoji"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+PGNpcmNsZSBmaWxsPSIjMzEzNzNEIiBjeD0iMTgiIGN5PSIxOCIgcj0iMTgiLz48L3N2Zz4=" alt="black_circle" width="24px" height="24px"></span>',
      ),
    )
  })
})
