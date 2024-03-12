import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx)', '../docs/*.stories.mdx'],
  addons: [
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    {
      name: '@storybook/addon-docs',
      options: { transcludeMarkdown: true },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
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
  staticDirs: ['../public'],
}
export default config
