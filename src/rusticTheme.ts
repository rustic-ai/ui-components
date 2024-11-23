/* eslint-disable no-magic-numbers */
import type { Palette, PaletteColor, Shadows } from '@mui/material/styles'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { deepmerge } from '@mui/utils'

const blackColor = '#000000'
const whiteColor = '#FFFFFF'
const secondaryMainColor = '#FF6928'
const secondaryDarkColor = '#E54500'
const secondaryLightColor = '#FF692899'
const secondaryFocusVisibleColor = '#FF69284D'

interface CustomPaletteColor {
  focus?: string
  hover?: string
  selected?: string
  focusVisible?: string
  border?: string
}

declare module '@mui/material/styles' {
  export interface RusticPalette extends Palette {
    primary: PaletteColor & CustomPaletteColor
    secondary: PaletteColor & CustomPaletteColor
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    rusticPrimary: true
    rusticSecondary: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    rusticPrimary: true
    rusticSecondary: true
  }
  interface ChipPropsSizeOverrides {
    large: true
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    body1Bold: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body1Bold?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body1Bold: true
  }
}

const baseTheme = createTheme({
  cssVariables: true,
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontStyle: 'normal',
      fontWeight: 300,
      fontSize: '94px',
      lineHeight: 1.167,
      letterSpacing: '-1.5px',
    },
    h2: {
      fontStyle: 'normal',
      fontWeight: 300,
      fontSize: '59px',
      letterSpacing: '-2px',
      lineHeight: 1.2,
    },
    h3: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '47px',
      letterSpacing: '0px',
      lineHeight: 1.167,
    },
    h4: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '33px',
      letterSpacing: '0px',
      lineHeight: 1.235,
    },
    h5: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '24px',
      letterSpacing: '0px',
      lineHeight: 1.334,
    },
    h6: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '20px',
      letterSpacing: '0px',
      lineHeight: 1.6,
    },
    body1: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      letterSpacing: '0px',
      lineHeight: 1.5,
    },
    body1Bold: {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      letterSpacing: '0px',
      lineHeight: 1.5,
    },
    body2: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      letterSpacing: '0px',
      lineHeight: 1.43,
    },
    subtitle1: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      letterSpacing: '0px',
      lineHeight: 1.75,
    },
    subtitle2: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '14px',
      letterSpacing: '0px',
      lineHeight: 1.57,
    },
    overline: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '10px',
      letterSpacing: '0px',
      lineHeight: 1.5,
      textTransform: 'uppercase',
    },
    caption: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '12px',
      letterSpacing: '0px',
      lineHeight: 1.66,
    },
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
  palette: {
    common: {
      black: blackColor,
      white: whiteColor,
    },
    error: {
      main: '#F82A43',
      dark: '#C82639',
      light: '#FF9BA7',
    },
    warning: {
      main: '#FFB800',
      dark: '#DC8400',
      light: '#FFDB7D',
    },
    info: {
      main: '#0094FF',
      dark: '#005A9B',
      light: '#8CCFFF',
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

const smallButtonAndChipStyle = {
  fontSize: '12px',
  lineHeight: 1.5,
  letterSpacing: '0.5px',
  padding: '0 12px',
  minHeight: '26px',
}

const mediumButtonAndChipStyle = {
  fontSize: '14px',
  lineHeight: 1.43,
  letterSpacing: '0.25px',
  padding: '0 16px',
  minHeight: '40px',
}

const largeButtonAndChipStyle = {
  fontSize: '16px',
  lineHeight: 1.75,
  letterSpacing: '0.15px',
  padding: '0 24px',
  minHeight: '64px',
}

const lightModeDividerColor = '#E1D9D5'
const lightModeFocusColor = '#0000001F'
const lightModePrimaryMainColor = '#2D2825'
const lightModePrimaryLightColor = '#2D282599'
const lightModeTextPrimaryColor = '#1E0C04'
const lightModeTextDisabledColor = '#9C9795'
const lightModeDisabledColor = '#00000061'
const lightModePrimaryHoverColor = '#2D282514'
const lightModePrimarySelectedColor = '#2D282529'
const lightModePrimaryFocusColor = '#2D28251F'
const lightModePrimaryFocusVisibleColor = '#2D28254D'
const lightModePrimaryBorder = '#2D282580'

const lightModeSecondaryHoverColor = '#FF692814'
const lightModeSecondarySelectedColor = '#FF692829'
const lightModeSecondaryFocusColor = '#FF69281F'
const lightModeSecondaryBorder = '#FF692880'

const buttonGeneralStyle = {
  fontWeight: 700,
}

const lightModeDisabledButtonStyling = {
  '&.Mui-disabled': {
    background: whiteColor,
    color: lightModeTextDisabledColor,
    border: `1px solid ${lightModeDisabledColor}`,
  },
}

const lightModePrimaryButtonBasestyle = {
  ...buttonGeneralStyle,
  background: lightModePrimaryMainColor,
  color: whiteColor,
  '&:hover': {
    background: lightModePrimaryLightColor,
  },
  '&:focus': {
    border: `4px solid ${lightModePrimaryLightColor}`,
  },
  ...lightModeDisabledButtonStyling,
}

const lightModeSecondaryButtonBasestyle = {
  ...buttonGeneralStyle,
  background: whiteColor,
  color: lightModeTextPrimaryColor,
  border: `1px solid ${lightModePrimaryLightColor}`,
  '&:focus': {
    border: `4px solid ${lightModePrimaryLightColor}`,
  },
  ...lightModeDisabledButtonStyling,
}

const chipGeneralStyle = {
  fontWeight: 400,
  '& .MuiChip-label': {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}
const lightModePrimaryChipBasestyle = {
  background: lightModePrimaryFocusVisibleColor,
  color: lightModeTextPrimaryColor,
  border: `1px solid ${lightModePrimaryBorder}`,
  '&:hover': {
    border: `1px solid ${lightModePrimaryBorder}`,
    background: lightModePrimaryHoverColor,
  },
  '&:focus': {
    border: `3px solid ${lightModePrimaryBorder}`,
    background: lightModePrimaryFocusColor,
  },
  '&.Mui-disabled': {
    background: lightModeDisabledColor,
    opacity: 100,
    border: 'none',
    color: whiteColor,
    '& .MuiChip-icon': {
      color: whiteColor,
    },
  },
  '& .MuiChip-icon': {
    margin: '0px 8px 0px 0px',
    color: lightModeTextPrimaryColor,
  },
  ...chipGeneralStyle,
}

const lightModeSecondaryChipBasestyle = {
  background: whiteColor,
  color: lightModeTextPrimaryColor,
  border: `1px solid ${secondaryLightColor}`,
  '&:focus': {
    border: `4px solid ${secondaryLightColor}`,
  },
  '&.Mui-disabled': {
    border: `1px solid ${secondaryLightColor}`,
    background: whiteColor,
    color: secondaryLightColor,
    opacity: 100,
  },
  '& .MuiChip-icon': {
    margin: '0px 8px 0px 0px',
    color: lightModeTextPrimaryColor,
  },
  ...chipGeneralStyle,
}

let rusticLightTheme = createTheme(
  deepmerge(baseTheme, {
    palette: {
      mode: 'light',
      divider: lightModeDividerColor,
      text: {
        primary: lightModeTextPrimaryColor,
        secondary: '#4E443F',
        disabled: lightModeTextDisabledColor,
      },
      primary: {
        main: lightModePrimaryMainColor,
        dark: blackColor,
        light: lightModePrimaryLightColor,
        contrastText: whiteColor,
        focus: lightModePrimaryFocusColor,
        focusVisible: lightModePrimaryFocusVisibleColor,
        hover: lightModePrimaryHoverColor,
        selected: lightModePrimarySelectedColor,
        border: lightModePrimaryBorder,
      },
      secondary: {
        main: secondaryMainColor,
        light: secondaryLightColor,
        dark: secondaryDarkColor,
        contrastText: whiteColor,
        focus: lightModeSecondaryFocusColor,
        focusVisible: secondaryFocusVisibleColor,
        hover: lightModeSecondaryHoverColor,
        selected: lightModeSecondarySelectedColor,
        border: lightModeSecondaryBorder,
      },
      background: {
        default: '#F7F6F5',
        paper: whiteColor,
      },
      action: {
        active: '#0000008F',
        hover: '#00000014',
        selected: '#00000029',
        disabledBackground: lightModeFocusColor,
        focus: lightModeFocusColor,
        disabled: lightModeDisabledColor,
      },
      success: {
        main: '#007F51',
        dark: '#014F33',
        light: '#00D788',
        contrastText: whiteColor,
      },
      error: {
        contrastText: whiteColor,
      },
      warning: {
        contrastText: whiteColor,
      },
      info: {
        contrastText: whiteColor,
      },
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: lightModePrimaryMainColor,
            color: whiteColor,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: lightModeFocusColor,
          },
          root: {
            borderBottom: `1px solid ${lightModeDividerColor}`,
            padding: '8px 16px',
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            '&.Mui-active': {
              '& .MuiTableSortLabel-icon': {
                color: lightModeTextPrimaryColor,
              },
            },
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            border: `1px solid ${lightModeDividerColor}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        variants: [
          {
            props: { variant: 'rusticPrimary', size: 'small' },
            style: {
              borderRadius: '16px',
              ...smallButtonAndChipStyle,
              ...lightModePrimaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticPrimary', size: 'medium' },
            style: {
              borderRadius: '24px',
              ...mediumButtonAndChipStyle,
              ...lightModePrimaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticPrimary', size: 'large' },
            style: {
              borderRadius: '32px',
              ...largeButtonAndChipStyle,
              ...lightModePrimaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'small' },
            style: {
              borderRadius: '16px',
              '&:hover': {
                border: `1px solid ${blackColor}`,
                background: whiteColor,
              },
              ...smallButtonAndChipStyle,
              ...lightModeSecondaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'medium' },
            style: {
              borderRadius: '24px',
              '&:hover': {
                border: `2px solid ${blackColor}`,
                background: whiteColor,
              },
              ...mediumButtonAndChipStyle,
              ...lightModeSecondaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'large' },
            style: {
              borderRadius: '32px',
              '&:hover': {
                border: `2px solid ${blackColor}`,
                background: whiteColor,
              },
              ...largeButtonAndChipStyle,
              ...lightModeSecondaryButtonBasestyle,
            },
          },
        ],
      },
      MuiChip: {
        variants: [
          {
            props: { variant: 'rusticPrimary', size: 'small' },
            style: {
              borderRadius: '24px',
              ...smallButtonAndChipStyle,
              ...lightModePrimaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticPrimary', size: 'medium' },
            style: {
              borderRadius: '32px',
              ...mediumButtonAndChipStyle,
              ...lightModePrimaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticPrimary', size: 'large' },
            style: {
              borderRadius: '48px',
              ...largeButtonAndChipStyle,
              ...lightModePrimaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'small' },
            style: {
              borderRadius: '24px',
              '&:hover': {
                border: `1px solid ${secondaryMainColor}`,
                background: whiteColor,
              },
              ...smallButtonAndChipStyle,
              ...lightModeSecondaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'medium' },
            style: {
              borderRadius: '32px',
              '&:hover': {
                border: `2px solid ${secondaryMainColor}`,
                background: whiteColor,
              },
              ...mediumButtonAndChipStyle,
              ...lightModeSecondaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'large' },
            style: {
              borderRadius: '48px',
              '&:hover': {
                border: `2px solid ${secondaryMainColor}`,
                background: whiteColor,
              },
              ...largeButtonAndChipStyle,
              ...lightModeSecondaryChipBasestyle,
            },
          },
        ],
      },
    },
  })
)

const darkModeTextDisabledColor = '#FFFFFF61'
const darkModeFocusColor = '#FFFFFF1F'
const darkModeDividerColor = '#E1D9D5'
const darkModePaperColor = '#202020'
const darkModePrimaryMainColor = '#FFFCFB'
const darkModePrimaryLightColor = '#FFFCFB99'
const darkModeContrastColor = '#000000DE'
const darkModeActionDisabledColor = '#FFFFFF61'
const darkModePrimaryBorderColor = '#FF692880'
const darkModePrimaryFocusColor = '#FFFCFB1F'
const darkModePrimaryFocusVisibleColor = '#FFFCFB4D'
const darkModePrimaryHoverColor = '#FFFCFB14'
const darkModeActionActiveColor = '#FFFFFF4D'

const darkModeDisabledButtonStyling = {
  '&.Mui-disabled': {
    background: darkModeActionActiveColor,
    color: darkModeTextDisabledColor,
    border: `1px solid ${darkModeActionDisabledColor}`,
  },
}

const darkModePrimaryButtonBasestyle = {
  ...buttonGeneralStyle,
  background: darkModePrimaryMainColor,
  color: blackColor,
  '&:hover': {
    background: darkModePrimaryLightColor,
  },
  '&:focus': {
    border: `4px solid ${darkModePrimaryLightColor}`,
  },
  ...darkModeDisabledButtonStyling,
}

const darkModeSecondaryButtonBasestyle = {
  ...buttonGeneralStyle,
  background: darkModePaperColor,
  color: whiteColor,
  border: `1px solid ${darkModePrimaryLightColor}`,
  '&:focus': {
    border: `4px solid ${darkModePrimaryLightColor}`,
  },
  ...darkModeDisabledButtonStyling,
}

const darkModePrimaryChipBasestyle = {
  background: darkModePrimaryFocusVisibleColor,
  color: whiteColor,
  border: `1px solid ${darkModePrimaryBorderColor}`,
  '&:hover': {
    border: `1px solid ${darkModePrimaryBorderColor}`,
    background: darkModePrimaryHoverColor,
  },
  '&:focus': {
    border: `4px solid ${darkModePrimaryLightColor}`,
    background: darkModePrimaryFocusColor,
  },
  '&.Mui-disabled': {
    background: darkModeActionDisabledColor,
    opacity: 100,
    border: 'none',
    color: darkModeContrastColor,
    '& .MuiChip-icon': {
      color: darkModeContrastColor,
    },
  },
  ...chipGeneralStyle,
  '& .MuiChip-icon': {
    margin: '0px 8px 0px 0px',
    color: whiteColor,
  },
}

const darkModeSecondaryChipBasestyle = {
  background: darkModePaperColor,
  color: whiteColor,
  border: `1px solid ${secondaryLightColor}`,
  '&:focus': {
    border: `4px solid ${secondaryLightColor}`,
  },
  '&.Mui-disabled': {
    background: darkModePaperColor,
    color: secondaryLightColor,
    border: `1px solid ${secondaryLightColor}`,
    opacity: 100,
  },
  '& .MuiChip-icon': {
    margin: '0px 8px 0px 0px',
    color: whiteColor,
  },
  ...chipGeneralStyle,
}

let rusticDarkTheme = createTheme(
  deepmerge(baseTheme, {
    palette: {
      mode: 'dark',
      divider: darkModeDividerColor,
      primary: {
        main: darkModePrimaryMainColor,
        dark: whiteColor,
        light: darkModePrimaryLightColor,
        contrastText: darkModeContrastColor,
        hover: darkModePrimaryHoverColor,
        selected: '#FFFCFB29',
        focus: darkModePrimaryFocusColor,
        focusVisible: darkModePrimaryFocusVisibleColor,
        border: darkModePrimaryBorderColor,
      },
      secondary: {
        main: secondaryMainColor,
        light: secondaryLightColor,
        dark: secondaryDarkColor,
        contrastText: darkModeContrastColor,
        hover: '#FF692814',
        selected: '#FF692829',
        focus: '#FF69281F',
        focusVisible: secondaryFocusVisibleColor,
        border: '#FF692880',
      },
      background: {
        default: '#2C2C2C',
        paper: darkModePaperColor,
      },
      text: {
        primary: whiteColor,
        secondary: '#FFFFFFB2',
        disabled: darkModeTextDisabledColor,
      },
      action: {
        active: darkModeActionActiveColor,
        hover: darkModeActionActiveColor,
        selected: '#FFFFFF29',
        focus: darkModeFocusColor,
        disabledBackground: darkModeFocusColor,
        disabled: darkModeActionDisabledColor,
      },
      success: {
        main: '#00B775',
        dark: '#01784D',
        light: '#00E390',
        contrastText: darkModeContrastColor,
      },
      error: {
        contrastText: darkModeContrastColor,
      },
      warning: {
        contrastText: darkModeContrastColor,
      },
      info: {
        contrastText: darkModeContrastColor,
      },
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: darkModePrimaryMainColor,
            color: blackColor,
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            '&.Mui-active': {
              '& .MuiTableSortLabel-icon': {
                color: whiteColor,
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: darkModeFocusColor,
          },
          root: {
            borderBottom: `1px solid ${darkModeDividerColor}`,
            padding: '8px 16px',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            border: `1px solid ${darkModeDividerColor}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        variants: [
          {
            props: { variant: 'rusticPrimary', size: 'small' },
            style: {
              borderRadius: '24px',
              ...smallButtonAndChipStyle,
              ...darkModePrimaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticPrimary', size: 'medium' },
            style: {
              borderRadius: '32px',
              ...mediumButtonAndChipStyle,
              ...darkModePrimaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticPrimary', size: 'large' },
            style: {
              borderRadius: '48px',
              ...largeButtonAndChipStyle,
              ...darkModePrimaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'small' },
            style: {
              borderRadius: '24px',
              '&:hover': {
                background: darkModePaperColor,
                border: `1px solid ${secondaryMainColor}`,
              },
              ...smallButtonAndChipStyle,
              ...darkModeSecondaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'medium' },
            style: {
              borderRadius: '32px',
              '&:hover': {
                background: darkModePaperColor,
                border: `2px solid ${secondaryMainColor}`,
              },
              ...mediumButtonAndChipStyle,
              ...darkModeSecondaryChipBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'large' },
            style: {
              borderRadius: '48px',
              '&:hover': {
                background: darkModePaperColor,
                border: `2px solid ${secondaryMainColor}`,
              },
              ...largeButtonAndChipStyle,
              ...darkModeSecondaryChipBasestyle,
            },
          },
        ],
      },
      MuiButton: {
        variants: [
          {
            props: { variant: 'rusticPrimary', size: 'small' },
            style: {
              borderRadius: '8px',
              ...smallButtonAndChipStyle,
              ...darkModePrimaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticPrimary', size: 'medium' },
            style: {
              borderRadius: '12px',
              ...mediumButtonAndChipStyle,
              ...darkModePrimaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticPrimary', size: 'large' },
            style: {
              borderRadius: '16px',
              ...largeButtonAndChipStyle,
              ...darkModePrimaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'small' },
            style: {
              borderRadius: '8px',
              '&:hover': {
                background: darkModePaperColor,
                border: `1px solid ${whiteColor}`,
              },
              ...smallButtonAndChipStyle,
              ...darkModeSecondaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'medium' },
            style: {
              borderRadius: '12px',
              '&:hover': {
                background: darkModePaperColor,
                border: `2px solid ${whiteColor}`,
              },
              ...mediumButtonAndChipStyle,
              ...darkModeSecondaryButtonBasestyle,
            },
          },
          {
            props: { variant: 'rusticSecondary', size: 'large' },
            style: {
              borderRadius: '16px',
              '&:hover': {
                background: darkModePaperColor,
                border: `2px solid ${whiteColor}`,
              },
              ...largeButtonAndChipStyle,
              ...darkModeSecondaryButtonBasestyle,
            },
          },
        ],
      },
    },
  })
)

rusticLightTheme = responsiveFontSizes(rusticLightTheme)
rusticDarkTheme = responsiveFontSizes(rusticDarkTheme)
export default rusticLightTheme
export { rusticDarkTheme, rusticLightTheme }
