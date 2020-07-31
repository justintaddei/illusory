import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
import { uglify } from 'rollup-plugin-uglify'
import resolve from '@rollup/plugin-node-resolve'

export default [
  {
    input: './src/index.ts',

    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            declarationDir: pkg.types
          }
        }
      }),
      resolve()
    ],

    output: [
      {
        file: pkg.module,
        format: 'es'
      }
    ]
  },
  {
    input: './src/index.ts',

    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5',
            declaration: false
          }
        }
      }),
      resolve(),
      uglify({
        sourcemap: false,
        output: {
          comments: 'all'
        }
      })
    ],

    output: [
      {
        file: pkg.main,
        format: 'iife',
        name: 'window',
        extend: true
      }
    ]
  }
]
