/* eslint-disable @typescript-eslint/no-empty-function */
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React from 'react'

import NavBar from './navBar'

const meta = {
  title: 'Rustic UI/Nav Bar/Nav Bar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `NavBar` component provides a customizable navigation bar that can be used to create a consistent layout across web applications. It typically includes a logo or branding element in the center, along with buttons or icons for accessing various navigation options such as drawers or menus. Note: The icon buttons will only be shown on mobile and tablet screens.',
      },
    },
  },
}

export default meta

const Logo = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Typography sx={{ color: 'secondary.main' }}>RUSTIC&nbsp;</Typography>
      <Typography>UI</Typography>
    </Box>
  )
}

function renderIcon(iconName: string) {
  return <span className="material-symbols-rounded">{iconName}</span>
}

export const Default = {
  args: {
    logo: <Logo />,
    leftDrawerIcon: renderIcon('chat'),
    rightDrawerIcon: renderIcon('bookmark'),
    leftDrawerAriaLabel: 'Open Left Drawer',
    rightDrawerAriaLabel: 'Open Right Drawer',
    handleLeftDrawerToggle: () => {},
    handleRightDrawerToggle: () => {},
  },
}
