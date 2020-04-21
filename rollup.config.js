import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

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
      })
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
      })
    ],

    output: [
      {
        file: pkg.main,
        format: 'cjs'
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
      })
    ],

    output: [
      {
        file: pkg.browser,
        format: 'iife',
        name: 'window',
        extend: true
      }
    ]
  }
]
