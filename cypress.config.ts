import { defineConfig } from 'cypress'

import webpackConfig from './webpack.config'

export default defineConfig({
  chromeWebSecurity: false,
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig,
    },
  },
})
