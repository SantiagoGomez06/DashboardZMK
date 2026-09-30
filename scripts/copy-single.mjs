import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const destDir = 'release'
await mkdir(destDir, { recursive: true })
await copyFile(path.join('dist', 'index.html'), path.join(destDir, 'ZMK-Dashboard.html'))
console.log('Copia: release/ZMK-Dashboard.html')
