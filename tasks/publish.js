'use strict'
const path = require('path')
const fs = require('fs')
const { publish: npmPublish } = require('libnpmpublish')

const publish = async (directory) => {
    const pkg = require(path.join(directory, 'package.json'))
    if (process.env.DRY_RUN) {
      console.log(`${pkg.name}@${pkg.version}`)
    } else {
      return npmPublish(directory, pkg, { token: process.env.NPM_AUTH_TOKEN, access: 'public' })
    }
  }

;(async () => {
  try {
    if (process.env.DRY_RUN) {
      console.warn('Dry run! To publish the release, run the command again without DRY_RUN environment variable')
    }
    const projectRootDirectory = path.join(__dirname, '..')
    await publish(path.join(projectRootDirectory))
  } catch (e) {
    console.log('Unable to publish the package', e)
    process.exit(1)
  }
})()

