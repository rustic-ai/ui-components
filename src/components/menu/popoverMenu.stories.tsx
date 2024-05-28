import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import type { Meta } from '@storybook/react'
import React from 'react'

import Icon from '../icon/icon'
import PopoverMenu from './popoverMenu'

const meta: Meta<React.ComponentProps<typeof PopoverMenu>> = {
  title: 'Rustic UI/Menu/Popover Menu',
  component: PopoverMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `PopoverMenu` component is a versatile menu display component designed to simplify the presentation of menu items within your application. It provides a clean and customizable interface for rendering a list of menu items in a popup menu format.\n\nNote: `onClose` functionality is built into the component and will be triggered when the user clicks outside of the menu as well as menu items.',
      },
    },
  },
}
export default meta

meta.argTypes = {
  ...meta.argTypes,
  menuItems: {
    table: {
      type: {
        summary: 'An array of PopoverMenuItem.\n',
        detail:
          'Each PopoverMenuItem has the following fields:\n' +
          '  label: Text label displayed for the menu item..\n' +
          '  onClick: An optional function that gets called when the menu item is clicked. It receives an optional MouseEvent object as an argument.\n' +
          '  startDecorator: An optional React node that will be rendered at the beginning of the menu item. This can be used for icons or other decorative elements.\n' +
          '  endDecorator: An optional React node that will be rendered at the end of the menu item. This is typically used for icons or other decorative elements.\n' +
          '  href: An optional URL that, if provided, makes the menu item behave like a link. When the menu item is clicked, the browser will navigate to this URL.\n' +
          '  downloadFileName: An optional string specifying the filename for downloading content. This works in conjunction with the href property to allow users to download a file when the menu item is clicked.',
      },
    },
  },
}

const pinIcon = <Icon name="keep" />
const addBoxIcon = (
  <Box sx={{ color: 'secondary.main' }}>
    <Icon name="add_box" />
  </Box>
)
const deleteIcon = <Icon name="delete" />
const thermostatIcon = <Icon name="device_thermostat" />
const listIcon = <Icon name="list" />

const defaultMenuItems = [
  {
    label: 'Rename',
    onClick: () => {},
    startDecorator: <Icon name="edit" />,
  },
  {
    label: 'Pin Topic',
    onClick: () => {},
    startDecorator: pinIcon,
  },
  {
    label: 'Share',
    onClick: () => {},
    startDecorator: <Icon name="ios_share" />,
  },
  {
    label: 'View Participants',
    onClick: () => {},
    startDecorator: <Icon name="groups" />,
  },
  {
    label: 'Leave Topic',
    onClick: () => {},
    startDecorator: <Icon name="exit_to_app" />,
  },
  {
    label: 'Delete',
    onClick: () => {},
    startDecorator: deleteIcon,
  },
]

const renderPinIconWithColor = (
  <Box sx={{ color: 'secondary.main' }}>{pinIcon}</Box>
)
const endDecoratorMenuItems = [
  {
    label: 'Charts',
    onClick: () => {},
    endDecorator: renderPinIconWithColor,
  },
  {
    label: 'Graphs',
    onClick: () => {},
    endDecorator: renderPinIconWithColor,
  },
  {
    label: 'Marketing',
    onClick: () => {},
    endDecorator: renderPinIconWithColor,
  },
]

const startAndEndDecoratorMenuItems = [
  {
    label: 'Celsius',
    onClick: () => {},
    startDecorator: thermostatIcon,
    endDecorator: addBoxIcon,
  },
  {
    label: 'Fahrenheit',
    onClick: () => {},
    startDecorator: thermostatIcon,
    endDecorator: addBoxIcon,
  },
]

const textDecorator = [
  {
    label: 'Celsius',
    onClick: () => {},
    startDecorator: thermostatIcon,
    endDecorator: <Typography variant="caption">°C</Typography>,
  },
  {
    label: 'Fahrenheit',
    onClick: () => {},
    startDecorator: thermostatIcon,
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
    icon: listIcon,
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
    icon: listIcon,
    buttonText: 'Menu',
  },
}

export const WithLink = {
  args: {
    menuItems: [
      {
        label: 'Go To Rustic AI',
        href: 'https://www.rustic.ai',
      },
    ],
    ariaLabel: 'open default menu',
  },
}

export const WithDownloadLink = {
  args: {
    menuItems: [
      {
        label: 'Download Logo',
        href: 'images/rustic-ui-logo.svg',
        downloadFileName: 'rustic-logo',
      },
    ],
    ariaLabel: 'open default menu',
  },
}
