import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
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
import { rusticLightTheme, rusticDarkTheme } from '../src/rusticTheme'

import React from 'react'

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      title: 'Theme',
      items: ['light', 'dark'],
      showName: true,
    },
  },
}

const withMuiTheme = (Story, context) => {
  const theme =
    context.globals.theme === 'light' ? rusticLightTheme : rusticDarkTheme

  React.useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default
  }, [context.globals.theme])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {/* add a div wrapper to show dark mode properly. Otherwise the background color would be white. */}
        <div
          style={{
            backgroundColor: theme.palette.background.paper,
            padding: '24px',
            borderRadius: '8px',
          }}
        >
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0"
          />
          <CssBaseline />
          <Story />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

const preview = {
  globalTypes,
  decorators: [withMuiTheme],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
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

export const webpackFinal = async (config) => {
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
    include: path.resolve(__dirname, '../'),
  })

  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    use: [
      {
        loader: 'file-loader',
        query: {
          name: 'Inter-VariableFont_slnt,wght.ttf',
        },
      },
    ],
    type: 'asset/resource',
  })

  return config
}

export default preview
