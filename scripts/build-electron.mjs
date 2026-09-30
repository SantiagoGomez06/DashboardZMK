import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['electron/main.ts', 'electron/preload.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outdir: 'electron/out',
  external: ['electron'],
  outExtension: { '.js': '.cjs' },
})

console.log('Electron compilado en electron/out')
