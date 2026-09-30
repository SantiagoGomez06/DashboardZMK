import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = path.join(root, 'build', 'icon.svg')
const pngPath = path.join(root, 'build', 'icon.png')
const icoPath = path.join(root, 'build', 'icon.ico')

await mkdir(path.join(root, 'build'), { recursive: true })

await sharp(svgPath).resize(256, 256).png().toFile(pngPath)
const ico = await pngToIco(pngPath)
await writeFile(icoPath, ico)
console.log('Iconos generados en build/')
