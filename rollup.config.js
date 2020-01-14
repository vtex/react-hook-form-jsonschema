import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs',
  },
  plugins: [resolve(), typescript()],
}
