import AddBoxIcon from '@mui/icons-material/AddBox'
import DeleteIcon from '@mui/icons-material/Delete'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import GroupsIcon from '@mui/icons-material/Groups'
import IosShareIcon from '@mui/icons-material/IosShare'
import ListIcon from '@mui/icons-material/List'
import PushPinIcon from '@mui/icons-material/PushPin'
import Typography from '@mui/material/Typography'
import React from 'react'

import PopoverMenu from './popoverMenu'

export default {
  title: 'Rustic UI/Menu/Popover Menu',
  component: PopoverMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `PopoverMenu` component is a versatile menu display component designed to simplify the presentation of menu items within your application. It provides a clean and customizable interface for rendering a list of menu items in a popup menu format. Note: `onClose` functionality is built into the component and will be triggered when the user clicks outside of the menu as well as menu items.',
      },
    },
  },
  argTypes: {
    menuItems: {
      description:
        'An array of menu items to be displayed in the menu. \n<pre>```interface PopoverMenuItem {\n  label: string\n  onClick: (event?: React.MouseEvent<HTMLElement>) => void\n  startDecorator?: ReactNode\n  endDecorator: ReactNode\n}```</pre>',
    },
  },
}

const defaultMenuItems = [
  {
    label: 'Rename',
    onClick: () => {},
    startDecorator: <EditIcon />,
  },
  {
    label: 'Pin Topic',
    onClick: () => {},
    startDecorator: <PushPinIcon />,
  },
  {
    label: 'Share',
    onClick: () => {},
    startDecorator: <IosShareIcon />,
  },
  {
    label: 'View Participants',
    onClick: () => {},
    startDecorator: <GroupsIcon />,
  },
  {
    label: 'Leave Topic',
    onClick: () => {},
    startDecorator: <ExitToAppIcon />,
  },
  {
    label: 'Delete',
    onClick: () => {},
    startDecorator: <DeleteIcon />,
  },
]

const endDecoratorMenuItems = [
  {
    label: 'Charts',
    onClick: () => {},
    endDecorator: <PushPinIcon sx={{ color: 'secondary.main' }} />,
  },
  {
    label: 'Graphs',
    onClick: () => {},
    endDecorator: <PushPinIcon sx={{ color: 'secondary.main' }} />,
  },
  {
    label: 'Marketing',
    onClick: () => {},
    endDecorator: <PushPinIcon sx={{ color: 'secondary.main' }} />,
  },
]

const startAndEndDecoratorMenuItems = [
  {
    label: 'Celsius',
    onClick: () => {},
    startDecorator: <DeviceThermostatIcon />,
    endDecorator: <AddBoxIcon sx={{ color: 'secondary.main' }} />,
  },
  {
    label: 'Fahrenheit',
    onClick: () => {},
    startDecorator: <DeviceThermostatIcon />,
    endDecorator: <AddBoxIcon sx={{ color: 'secondary.main' }} />,
  },
]

const textDecorator = [
  {
    label: 'Celsius',
    onClick: () => {},
    startDecorator: <DeviceThermostatIcon />,
    endDecorator: <Typography variant="caption">°C</Typography>,
  },
  {
    label: 'Fahrenheit',
    onClick: () => {},
    startDecorator: <DeviceThermostatIcon />,
    endDecorator: <Typography variant="caption">°F</Typography>,
  },
]

const noDecoratorsMenuItems = [
  {
    label: 'Celsius',
    onClick: () => {},
  },
  {
    label: 'Fahrenheit',
    onClick: () => {},
  },
]

export const Default = {
  args: {
    menuItems: defaultMenuItems,
    ariaLabel: 'open default menu',
  },
}

export const EndDecorator = {
  args: {
    menuItems: endDecoratorMenuItems,
    ariaLabel: 'open menu showing end decorators',
  },
}

export const StartAndEndDecorators = {
  args: {
    menuItems: startAndEndDecoratorMenuItems,
    ariaLabel: 'open menu showing start and end decorators',
  },
}

export const TextDecorator = {
  args: {
    menuItems: textDecorator,
    ariaLabel: 'open menu showing text decorators',
  },
}

export const NoDecorators = {
  args: {
    menuItems: noDecoratorsMenuItems,
    ariaLabel: 'open menu showing no decorators',
  },
}

export const WithCustomButtonIcon = {
  args: {
    menuItems: defaultMenuItems,
    ariaLabel: 'open menu showing custom button icon',
    icon: <ListIcon />,
  },
}

export const WithCustomButtonText = {
  args: {
    menuItems: defaultMenuItems,
    ariaLabel: 'open menu showing custom button text',
    buttonText: 'Menu',
  },
}

export const WithCustomButtonIconAndText = {
  args: {
    menuItems: defaultMenuItems,
    ariaLabel: 'open menu showing custom button icon and text',
    icon: <ListIcon />,
    buttonText: 'Menu',
  },
}
