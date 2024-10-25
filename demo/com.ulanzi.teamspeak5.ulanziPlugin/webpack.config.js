

import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './plugin/app.js',
  target: 'node', // 目标环境为Node.js
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'module', // 设置输出格式为 ES 模块
    chunkFormat: 'module' // 直接指定输出格式
  },
  mode: 'development', // ‌生产模式（production）,开发模式（development）
  module: {
    rules: [
      {
        //特殊处理svgdom打包后的fonts路径
        test: path.resolve(__dirname, 'node_modules/svgdom/src/utils/defaults.js'),
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: /__dirname\s*=\s*[^\)]+\)/,
                  replace:" __dirname = dirname(process.argv[1]"
                },
                {
                  search: /fontDir\s*=\s*[^\)]+\)/,
                  replace:" fontDir = join(__dirname, 'fonts/')"
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        // exclude: /node_modules/, // 如果你想包含node_modules内的JS文件，可以注释掉这一行
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: false }]],
          },
        },
      },
    ],
  },
  // 插件配置
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/svgdom/fonts/OpenSans-Regular.ttf', to: 'fonts/' },
      ],
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  experiments: {
      outputModule: true, // 启用模块输出
  }
};