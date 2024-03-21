import NotificationsIcon from '@mui/icons-material/Notifications'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

export default {
  title: 'Rustic UI/Tooltip/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "The Tooltip component offers a concise way to provide additional context or hints when users interact with elements in a UI. The library only customizes styling for MUI's tooltip to be inline with rusticTheme. For more information, please refer to the [MUI documentation](https://mui.com/material-ui/react-tooltip/).",
      },
    },
  },
}

export const Default = {
  args: {
    title: 'Notifications',
    children: (
      <IconButton>
        <NotificationsIcon />
      </IconButton>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `<Tooltip title="Notifications">
  <IconButton>
    <NotificationsIcon />
  </IconButton>
</Tooltip>`,
      },
    },
  },
}

export const ShowAtTop = {
  args: {
    title: 'Notifications',
    children: (
      <IconButton>
        <NotificationsIcon />
      </IconButton>
    ),
    placement: 'top',
  },
  parameters: {
    docs: {
      source: {
        code: `<Tooltip title="Notifications" placement='top'>
  <IconButton>
    <NotificationsIcon />
  </IconButton>
</Tooltip>`,
      },
    },
  },
}

export const CustomizeDistance = {
  args: {
    title: 'Notifications',
    children: (
      <IconButton>
        <NotificationsIcon />
      </IconButton>
    ),
    placement: 'top',
    slotProps: {
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: {
              // eslint-disable-next-line no-magic-numbers
              offset: [0, -14],
            },
          },
        ],
      },
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<Tooltip
  placement="top"
  slotProps={{
    popper: {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -14]
          }
        }
      ]
    }
  }}
  title="Notifications"
 >
  <IconButton>
    <NotificationsIcon />
  </IconButton>
</Tooltip>`,
      },
    },
  },
}
