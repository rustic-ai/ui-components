/* eslint-disable no-magic-numbers */
import type { Shadows } from '@mui/material/styles'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const dividerColor = '#DDD0CA'
const disabledColor = '#C7C2C0'
const muiGeneralSetting = {
  shape: {
    borderRadius: 16,
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
}

let rusticLightTheme = createTheme({
  ...muiGeneralSetting,
  palette: {
    mode: 'light',
    divider: dividerColor,
    text: {
      primary: '#1E0C04',
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
})

let rusticDarkTheme = createTheme({
  ...muiGeneralSetting,
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFCFB',
      dark: '#E54500',
      light: '#FFDBCC',
    },
    secondary: {
      main: '#FF6928',
      light: '#FFA983',
      dark: '#E54500',
    },
    error: {
      main: '#F82A43',
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
      default: '#040404',
      paper: '#2F2F2F',
    },
    divider: '#D0C4BE',
    text: {
      primary: '#FFFFFF',
      secondary: '#EBEBEB',
      disabled: '#C1C1C1',
    },
    action: {
      active: '#5F5C5A',
      hover: '#9A9A9A',
      selected: '#D6D0D0',
      focus: '#FDFDFD',
      disabledBackground: '#E5E5E5',
      disabled: '#C7C2C0',
    },
  },
})

rusticLightTheme = responsiveFontSizes(rusticLightTheme)
rusticDarkTheme = responsiveFontSizes(rusticDarkTheme)
export default rusticLightTheme
export { rusticDarkTheme, rusticLightTheme }
