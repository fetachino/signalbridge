import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const artifacts = resolve(root, 'artifacts')
const output = resolve(artifacts, 'signalbridge-firetv.zip')

const html = readFileSync(resolve(dist, 'index.html'), 'utf8')
if (html.includes('src="/') || html.includes('href="/')) {
  throw new Error('Fire TV package requires relative asset paths in dist/index.html')
}

mkdirSync(artifacts, { recursive: true })
rmSync(output, { force: true })

const tar = process.platform === 'win32' ? 'tar.exe' : 'tar'
execFileSync(tar, ['-a', '-c', '-f', output, '-C', dist, '.'], { stdio: 'inherit' })
console.log(`Created ${output}`)
