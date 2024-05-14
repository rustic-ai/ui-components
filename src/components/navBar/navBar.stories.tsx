/* eslint-disable @typescript-eslint/no-empty-function */
import { useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import Icon from '../icon'
import NavBar from './navBar'

const meta: Meta<React.ComponentProps<typeof NavBar>> = {
  title: 'Rustic UI/Nav Bar/Nav Bar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `NavBar` component provides a customizable navigation bar for web applications, offering both top and bottom navigation options. The top navigation bar can include a logo and various navigation items, while the bottom navigation bar is optimized for mobile devices.',
      },
    },
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ height: '300px' }}>
          <Story />
        </div>
      )
    },
  ],
}

meta.argTypes = {
  ...meta.argTypes,
  topNavBarItems: {
    table: {
      type: {
        summary: 'Array of TopNavBarItem.',
        detail:
          'Each TopNavBarItem has the following fields:\n' +
          '  node: A ReactNode to be rendered.',
      },
    },
  },
  bottomNavBarItems: {
    table: {
      type: {
        summary: 'Array of BottomNavBarItem.',
        detail:
          'Each BottomNavBarItem has the following fields:\n' +
          '  label: String label of the item. \n' +
          '  icon: ReactNode icon. \n' +
          '  onClick: A function that is called when the item is clicked.\n',
      },
    },
  },
}

export default meta

const Logo = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Typography sx={{ color: 'secondary.main', fontWeight: 700 }}>
        RUSTIC&nbsp;
      </Typography>
      <Typography sx={{ fontWeight: 700 }}>UI</Typography>
    </Box>
  )
}

const NotificationsIcon = () => {
  const theme = useTheme()
  return (
    <IconButton color="primary" sx={{ p: 0 }}>
      <Box
        sx={{
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Icon name="notifications" />
      </Box>
    </IconButton>
  )
}

const ProfileIcon = () => {
  const theme = useTheme()
  return (
    <IconButton sx={{ p: 0 }}>
      <Avatar
        sx={{
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        RU
      </Avatar>
    </IconButton>
  )
}

const topNavItems = [
  {
    node: <NotificationsIcon />,
  },
  {
    node: <ProfileIcon />,
  },
]

const bottomNavItems = [
  {
    label: 'Conversations',
    icon: <Icon name="forum" />,
  },
  {
    label: 'New Conversation',
    icon: <Icon name="add_circle_outline" />,
  },
  {
    label: 'Collections',
    icon: <Icon name="bookmark" />,
  },
]

export const Default = {
  args: {
    logo: <Logo />,
    topNavBarItems: topNavItems,
    bottomNavBarItems: bottomNavItems,
  },
}

export const NoBottomNav = {
  args: {
    logo: <Logo />,
    topNavBarItems: topNavItems,
  },
}

export const NoTopNav = {
  args: {
    bottomNavBarItems: bottomNavItems,
  },
}

export const NoTopNavItems = {
  args: {
    logo: <Logo />,
    bottomNavBarItems: bottomNavItems,
  },
}

export const NoLogo = {
  args: {
    topNavBarItems: topNavItems,
    bottomNavBarItems: bottomNavItems,
  },
}
