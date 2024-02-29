import { DEFAULT_VIEWPORT, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'
import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgTypes,
  Stories,
} from '@storybook/blocks'
import rusticTheme from '../src/rusticTheme'
import React from 'react'

const preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: DEFAULT_VIEWPORT,
    },
    controls: { expanded: true },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgTypes />
          <Stories />
        </>
      ),
    },
  },
}

export const withMuiTheme = (Story) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={rusticTheme}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <CssBaseline />
      <Story />
    </ThemeProvider>
  </StyledEngineProvider>
)

export const decorators = [withMuiTheme]

export const webpackFinal = async (config) => {
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
    include: path.resolve(__dirname, '../'),
  })

  return config
}

export default preview
