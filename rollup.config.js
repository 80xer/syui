import esbuild from 'rollup-plugin-esbuild';
import scss from 'rollup-plugin-scss';

export default {
  input: './src/index.ts',
  output: [
    {
      file: './lib/bundle.js',
      format: 'es',
      generatedCode: 'es2015',
      sourcemap: true
    },
    {
      file: './lib/bundle.cjs',
      format: 'cjs',
      generatedCode: 'es2015',
      sourcemap: true
    }
  ],
  plugins: [
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'es2017', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // Like @rollup/plugin-replace
      define: {
        __VERSION__: '"x.y.z"'
      },
      tsconfig: 'tsconfig.json', // default
      // Add extra loaders
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        '.json': 'json',
        // Enable JSX in .js files too
        '.js': 'jsx'
      }
    }),
    scss()
  ]
};
