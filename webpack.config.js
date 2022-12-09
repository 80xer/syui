import os from 'os';
import HtmlWebpackPlugin from 'html-webpack-plugin'; // 빌드된 js를 삽입한 html 생성
import MiniCssExtractPlugin from 'mini-css-extract-plugin'; // css 파일을 별도 파일로 추출
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'; // css 최적화(압축)

export default (env, { mode }) => {
  const isDev = mode === 'development';
  return {
    entry: './website/index.ts',
    output: {
      clean: true,
      filename: isDev ? '[name].js' : '[name].[contenthash].js',
      chunkFilename: isDev ? '[name].js' : '[contenthash].js'
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',

    devServer: {
      open: true,
      client: {
        overlay: false
      },
      static: false
    },

    stats: {
      assets: false,
      entrypoints: false,
      modules: false
    },

    performance: {
      hints: false
    },

    resolve: {
      extensions: ['.js', '.ts', '.tsx']
    },

    // 최적화 설정
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      // 압축
      // minimize: isDev ? false : true,
      // 미니마이저
      minimizer: [
        // 플러그인 인스턴스 생성
        new CssMinimizerPlugin({
          // CPU 멀티 프로세서 병렬화 옵션 (기본 값: true)
          parallel: os.cpus().length - 1
        })
      ]
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
            target: 'es2015'
          }
        },
        {
          test: /\.[s]css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['postcss-nested']
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './website/index.html'
      }),
      !isDev &&
        new MiniCssExtractPlugin({
          filename: '[contenthash].css',
          chunkFilename: '[contenthash].css',
          ignoreOrder: true
        })
    ].filter(Boolean)
  };
};
