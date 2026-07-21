#!/usr/bin/env node
// Changelog automation for the release workflow.
//
// Usage:
//   node tasks/changelog.js release <version>   Roll the "## Unreleased" section into a dated
//                                               "## v<version> (YYYY-MM-DD)" section and start a
//                                               fresh, empty "## Unreleased" section.
//   node tasks/changelog.js notes <version>     Print the "## v<version>" section to stdout
//                                               (used as the GitHub release notes).
//
// The changelog is CHANGELOG.md (Markdown): each release is a "## v<version> (date)" section.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRootDirectory = join(import.meta.dirname, '..')
const changelogPath = join(projectRootDirectory, 'CHANGELOG.md')

// Rolls the "## Unreleased" section into "## v<version> (<releaseDate>)" and
// starts a fresh, empty "## Unreleased" section above it.
export function rollUnreleased (content, version, releaseDate) {
  return content.replace(/^## Unreleased$/m, `## Unreleased\n\n## v${version} (${releaseDate})`)
}

// Extracts the "## v<version> (date)" section content.
export function extractReleaseNotes (content, version) {
  const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const headerRegex = new RegExp(`^## v${escapedVersion} \\([^)]+\\)\\n([\\s\\S]*?)(?=\\n## |$)`, 'm')
  const match = content.match(headerRegex)
  if (!match) {
    throw new Error(`Section "## v${version}" not found in CHANGELOG.md`)
  }
  return match[1].trim()
}

// Entry point — only runs when executed directly, not when imported by tests
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [command, version] = process.argv.slice(2)
  if (!version || !['release', 'notes'].includes(command)) {
    console.error('Usage: node tasks/changelog.js <release|notes> <version>')
    process.exit(9)
  }
  const content = readFileSync(changelogPath, 'utf8')
  if (command === 'release') {
    const releaseDate = new Date().toISOString().slice(0, 10)
    writeFileSync(changelogPath, rollUnreleased(content, version, releaseDate))
  } else {
    process.stdout.write(`${extractReleaseNotes(content, version)}\n`)
  }
}