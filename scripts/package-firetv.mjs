import { mkdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const artifacts = resolve(root, 'artifacts')
const output = resolve(artifacts, 'signalbridge-firetv.zip')

mkdirSync(artifacts, { recursive: true })
rmSync(output, { force: true })

const tar = process.platform === 'win32' ? 'tar.exe' : 'tar'
execFileSync(tar, ['-a', '-c', '-f', output, '-C', dist, '.'], { stdio: 'inherit' })
console.log(`Created ${output}`)
