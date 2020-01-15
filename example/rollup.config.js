import childProcess from 'child_process'
import path from 'path'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'

const production = !process.env.ROLLUP_WATCH

function serve() {
  let started = false

  return {
    writeBundle() {
      if (!started) {
        started = true

        childProcess.spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        })
      }
    },
  }
}

export default {
  input: 'src/index.jsx',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    alias({
      resolve: ['.jsx', '.js'],
      entries: [
        { find: 'react', replacement: path.resolve('node_modules/react') },
      ],
    }),
    resolve({
      browser: true,
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        // eslint-disable-next-line
        react: Object.keys(require('react')),
        // eslint-disable-next-line
        'react-dom': Object.keys(require('react-dom')),
      },
    }),
    babel({
      babelrc: false,
      presets: ['@babel/preset-react'],
    }),
    replace({
      'process.env.NODE_ENV': production ? '"production"' : '"development"',
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
