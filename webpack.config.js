const path = require('path')

const commonConfig = {
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  entry: './src/components/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: '@rustic-ai/ui-components',
      type: 'umd',
    },
    clean: true,
  },
}

module.exports = {
  ...commonConfig,
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}

exports.commonConfig = commonConfig
