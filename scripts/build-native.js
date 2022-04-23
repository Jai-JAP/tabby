#!/usr/bin/env node
const rebuild = require('electron-rebuild').default
const path = require('path')
const vars = require('./vars')

process.env.ARCH = process.env.ARCH || process.arch
if (process.env.ARCH === 'arm') {
  process.env.ARCH = 'armv7l'
}

let lifecycles = []
for (let dir of ['app', 'tabby-core', 'tabby-local', 'tabby-ssh', 'tabby-terminal']) {
    const build = rebuild({
        buildPath: path.resolve(__dirname, '../' + dir),
        electronVersion: vars.electronVersion,
        arch: process.env.ARCH,
        force: true,
    })
    build.catch(e => {
        console.error(e)
        process.exit(1)
    })
    lifecycles.push([build.lifecycle, dir])
}

console.info('Building against Electron', vars.electronVersion)

for (let [lc, dir] of lifecycles) {
    lc.on('module-found', name => {
        console.info('Rebuilding', dir + '/' + name)
    })
}
