import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

function commandPath(command) {
  try {
    const lookup = process.platform === 'win32' ? 'where.exe' : 'which'
    return execFileSync(lookup, [command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split(/\r?\n/)[0]
  } catch {
    return ''
  }
}

function status(label, ready, detail) {
  console.log(`${ready ? 'READY' : 'MISSING'}  ${label.padEnd(16)} ${detail}`)
}

console.log('SignalBridge Fire TV environment check')
console.log('')
status('Web package', Boolean(commandPath('node')), 'npm run package:firetv')
status('Node.js', Boolean(commandPath('node')), commandPath('node') || 'Install Node.js')
status('Java', Boolean(commandPath('java')), commandPath('java') || 'Install a JDK')
status('ADB', Boolean(commandPath('adb')), commandPath('adb') || 'Install Android SDK platform-tools')
status('Gradle', Boolean(commandPath('gradle')), commandPath('gradle') || 'Use Android Studio or the Gradle wrapper')

const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || ''
status('Android SDK', Boolean(androidHome && existsSync(androidHome)), androidHome || 'ANDROID_HOME is not set')
status('Vega SDK', Boolean(process.env.KEPLER_SDK_HOME), process.env.KEPLER_SDK_HOME || 'Not available in this Windows environment')

console.log('')
console.log('The HTML5 Fire TV package path is usable when Web App Tester or a hosted URL is available.')
console.log('Native Fire TV testing still requires Android Studio/SDK and a Fire TV target.')
