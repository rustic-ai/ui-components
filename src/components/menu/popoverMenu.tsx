import './popoverMenu.css'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import type { ReactNode } from 'react'
import React, { useRef, useState } from 'react'

export interface PopoverMenuItem {
  label: string
  onClick: (event?: React.MouseEvent<HTMLElement>) => void
  startDecorator?: ReactNode
  endDecorator?: ReactNode
}

export interface PopoverMenuProps {
  menuItems: PopoverMenuItem[]
  /** Aria-label to describe the button for assistive technology. */
  ariaLabel: string
  /** Provide your own customized icon. */
  icon?: ReactNode
  /** Text to display on the button. */
  buttonText?: string
}

export default function PopoverMenu(props: PopoverMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const theme = useTheme()

  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  const PopoverMenuElement = isMobileView ? Drawer : Menu

  let menuBorderStyles: object = {
    borderRadius: `${theme.shape.borderRadius}px`,
    border: `1px solid ${theme.palette.divider}`,
  }

  if (isMobileView) {
    menuBorderStyles = {
      ...menuBorderStyles,
      borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
      borderBottom: 0,
    }
  }

  const menuItems = props.menuItems.map((menuItem) => {
    function handleOnClick(event: React.MouseEvent<HTMLElement>) {
      menuItem.onClick(event)
      setIsMenuOpen(false)
    }

    return (
      <MenuItem key={menuItem.label} onClick={handleOnClick}>
        {menuItem.startDecorator && (
          <Box
            sx={{ color: 'primary.main' }}
            className="rustic-popover-menu-item-icon rustic-popover-menu-item-start-icon"
          >
            {menuItem.startDecorator}
          </Box>
        )}
        <ListItemText>
          <Typography variant="body2">{menuItem.label}</Typography>
        </ListItemText>
        {menuItem.endDecorator && (
          <Box
            sx={{ color: 'secondary.main' }}
            className="rustic-popover-menu-item-icon"
          >
            {menuItem.endDecorator}
          </Box>
        )}
      </MenuItem>
    )
  })

  function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setIsMenuOpen(true)
  }

  function renderButton() {
    const buttonAttributes = {
      onClick: handleOpenMenu,
      'aria-label': props.ariaLabel,
      ref: menuButtonRef,
      className: 'rustic-popover-menu-button',
    }

    if (props.buttonText) {
      return (
        <Button
          {...buttonAttributes}
          startIcon={props.icon ? props.icon : null}
          data-cy="menu-button"
        >
          {props.buttonText}
        </Button>
      )
    } else {
      return (
        <IconButton {...buttonAttributes} data-cy="menu-icon-button">
          {props.icon ? props.icon : <MoreVertIcon />}
        </IconButton>
      )
    }
  }

  return (
    <>
      {renderButton()}

      <PopoverMenuElement
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        anchorEl={menuButtonRef.current}
        anchor="bottom"
        className="rustic-popover-menu"
        sx={{
          '& .MuiPaper-root': {
            ...menuBorderStyles,
            backgroundImage: 'none',
            // eslint-disable-next-line no-magic-numbers
            boxShadow: theme.shadows[2],
          },
        }}
        data-cy="menu"
      >
        {menuItems}
      </PopoverMenuElement>
    </>
  )
}
