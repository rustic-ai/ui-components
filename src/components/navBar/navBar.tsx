import './navBar.css'

import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import type { ReactNode } from 'react'
import React from 'react'

import rusticTheme from '../../rusticTheme'

interface NavBarProps {
  /** Desktop version: Logo is displayed in the top left corner. Tablet and mobile versions: position will be different if you add the drawer icons. */
  logo: ReactNode
  /** Icon for the button that opens/closes the left drawer. (Will only be shown in mobile and tablet versions.) */
  leftDrawerIcon?: ReactNode
  /** Icon for the button that opens/closes the right drawer. (Will only be shown in mobile and tablet versions.)*/
  rightDrawerIcon?: ReactNode
  /** Aria label for the left drawer button. */
  leftDrawerAriaLabel?: string
  /** Aria label for the right drawer button. */
  rightDrawerAriaLabel?: string
  /** Function for toggling the open/closed state of the left drawer. */
  handleLeftDrawerToggle?: () => void
  /** Function for toggling the open/closed state of the right drawer. */
  handleRightDrawerToggle?: () => void
}

const NavBar = (props: NavBarProps) => {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{ borderBottom: `1px solid ${rusticTheme.palette.divider}` }}
      data-cy="nav-bar"
    >
      <Toolbar className="rustic-nav-bar">
        {props.leftDrawerIcon && (
          <IconButton
            color="inherit"
            aria-label={props.leftDrawerAriaLabel}
            edge="start"
            onClick={props.handleLeftDrawerToggle}
            className="rustic-nav-bar-button"
            data-cy="left-drawer-button"
          >
            {props.leftDrawerIcon}
          </IconButton>
        )}
        {props.logo}
        {props.rightDrawerIcon && (
          <IconButton
            color="inherit"
            aria-label={props.rightDrawerAriaLabel}
            edge="end"
            onClick={props.handleRightDrawerToggle}
            className="rustic-nav-bar-button"
            data-cy="right-drawer-button"
          >
            {props.rightDrawerIcon}
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
