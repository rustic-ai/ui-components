const commonConfig = require('./webpack.config.js')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  ...commonConfig,
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.prod.json',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  externalsPresets: { node: true },
  externals: [
    nodeExternals({
      allowlist: [
        'dompurify',
        '/^@fullcalendar/',
        'marked',
        'ol',
        'pluralize',
        'recharts',
        'uuid',
      ],
    }),
  ],
  plugins: [new MiniCssExtractPlugin({ filename: `index.css` })],
}
