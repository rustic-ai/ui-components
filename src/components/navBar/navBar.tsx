import './navBar.css'

import { useMediaQuery } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import type { ReactNode } from 'react'
import React from 'react'

export interface BottomNavBarItem {
  label: string
  onClick: () => void
  icon: ReactNode
}

export interface TopNavBarItem {
  node: ReactNode
}

export interface NavBarProps {
  /** The logo to be displayed in the navigation bar. */
  logo?: ReactNode

  /** An array of items to be displayed in the top navigation bar. We recommend at most 3 items. */
  topNavBarItems?: TopNavBarItem[]

  /** An array of items to be displayed in the bottom navigation bar on mobile devices. We recommend at most 3 items. */
  bottomNavBarItems?: BottomNavBarItem[]
}

/**
The `NavBar` component provides a customizable navigation bar for web applications, offering both top and bottom navigation options. The top navigation bar can include a logo and various navigation items, while the bottom navigation bar is optimized for mobile devices.
 */
const NavBar = (props: NavBarProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const topNavItems = props.topNavBarItems?.map((item, index) => (
    <React.Fragment key={index}>{item.node}</React.Fragment>
  ))

  const bottomNavItems = props.bottomNavBarItems?.map((item) => (
    <BottomNavigationAction
      key={item.label}
      label={item.label}
      value={item.label}
      icon={item.icon}
    />
  ))

  function handleOnClick(event: React.SyntheticEvent, newValue: string) {
    props.bottomNavBarItems?.find((item) => item.label === newValue)!.onClick()
  }

  return (
    <>
      {(props.logo ||
        (props.topNavBarItems && props.topNavBarItems.length > 0)) && (
        <AppBar
          position="fixed"
          color="inherit"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
          data-cy="nav-bar"
        >
          <Toolbar className="rustic-nav-bar-top" data-cy="nav-bar-top">
            {props.logo}

            {props.topNavBarItems && props.topNavBarItems.length > 0 && (
              <Box
                className="rustic-nav-bar-top-items"
                data-cy="nav-bar-top-items"
              >
                {topNavItems}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      )}
      {isMobile &&
        props.bottomNavBarItems &&
        props.bottomNavBarItems.length > 0 && (
          <BottomNavigation
            showLabels
            className="rustic-nav-bar-bottom"
            onChange={handleOnClick}
            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
            data-cy="nav-bar-bottom"
          >
            {bottomNavItems}
          </BottomNavigation>
        )}
    </>
  )
}

export default NavBar
