import type { StorybookConfig } from '@storybook/react-webpack5'
const path = require('path')
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx)', '../docs/*.mdx'],
  addons: [
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    'storybook-addon-mock',
    {
      name: '@storybook/addon-docs',
      options: { transcludeMarkdown: true },
    },
    '@storybook/addon-webpack5-compiler-swc',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
    reactDocgen: 'react-docgen',
    check: false,
  },
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
  staticDirs: [
    '../public',
    {
      from: path.resolve(
        __dirname,
        '../node_modules/emoji-picker-element-data'
      ),
      to: 'node_modules/emoji-picker-element-data',
    },
  ],
}
export default config
