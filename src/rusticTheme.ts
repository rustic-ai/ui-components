/* eslint-disable no-magic-numbers */
import type { Shadows } from '@mui/material/styles'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const dividerColor = '#DDD0CA'
const disabledColor = '#C7C2C0'

let theme = createTheme({
  shape: {
    borderRadius: 16,
  },
  palette: {
    mode: 'light',
    divider: dividerColor,
    text: {
      secondary: '#4E443F',
      disabled: disabledColor,
    },
    primary: {
      main: '#3D3834',
      contrastText: '#FFFFFF',
      dark: '#2D2825',
      light: dividerColor,
    },
    secondary: {
      main: '#FF6928',
      light: '#FFDBCC',
      dark: '#E54500',
    },
    error: {
      main: '#F82A43',
      dark: '#B51616',
    },
    warning: {
      main: '#FFB800',
    },
    info: {
      main: '#0094FF',
    },
    success: {
      main: '#35A700',
    },
    background: {
      default: '#F4F0EF',
      paper: '#FFFFFF',
    },
    action: {
      active: '#5F5C5A',
      hover: '#F1ECEA',
      selected: disabledColor,
      disabledBackground: '#E5E5E5',
      focus: '#F4F0EF',
      disabled: disabledColor,
    },
  },
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '96px',
      letterSpacing: '-1.5px',
    },
    h2: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '60px',
      letterSpacing: '-0.5px',
    },
    h3: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '48px',
      letterSpacing: '0px',
    },
    h4: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '34px',
      letterSpacing: '0.25px',
    },
    h5: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '24px',
      letterSpacing: '0px',
    },
    h6: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '20px',
      letterSpacing: '0.15px',
    },
    body1: {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '16px',
      letterSpacing: '0.15px',
    },
    body2: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      letterSpacing: '0.17px',
    },
    subtitle1: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      letterSpacing: '0.15px',
      textDecoration: 'none',
    },
    subtitle2: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '14px',
      letterSpacing: '0.01px',
    },
    overline: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      letterSpacing: '0.15px',
    },
    caption: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '12px',
      letterSpacing: '0.04px',
    },
  },
  shadows: [
    ...createTheme({}).shadows.map((shadow, i) => {
      if (i === 1) {
        return '0 4px 5px rgba(0, 0, 0, 0.05)'
      } else if (i === 2) {
        return '0 4px 10px rgba(0, 0, 0, 0.1)'
      } else if (i === 3) {
        return '0 4px 15px rgba(0, 0, 0, 0.15)'
      } else {
        return 'none'
      }
    }),
  ] as Shadows,
})

theme = responsiveFontSizes(theme)
export default theme
