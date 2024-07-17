const commonConfig = require('./webpack.config.js')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ts = require('typescript')
function removeJsxAttributesTransformer(attributes) {
  return (context) => {
    const visitor = (node) => {
      if (ts.isJsxAttribute(node) && attributes.includes(node.name.getText())) {
        return undefined
      }
      return ts.visitEachChild(node, visitor, context)
    }
    return (node) => ts.visitNode(node, visitor, context)
  }
}

function getCssFilename(pathData) {
  if (pathData.chunk.name === 'library') {
    return 'index.css'
  }
  return `components/${pathData.chunk.name}/index.css`
}

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
            getCustomTransformers: () => ({
              before: [removeJsxAttributesTransformer(['data-cy'])],
            }),
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: getCssFilename,
    }),
  ],
}
