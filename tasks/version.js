#!/usr/bin/env node
// Version automation for the release workflow.
//
// Usage:
//   node tasks/version.js <version>   Set the version in package.json

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const projectRootDirectory = join(import.meta.dirname, '..')
const pkgPath = join(projectRootDirectory, 'package.json')

const [version] = process.argv.slice(2)
if (!version) {
  console.error('Usage: node tasks/version.js <version>')
  process.exit(9)
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.version = version
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2).concat('\n'))