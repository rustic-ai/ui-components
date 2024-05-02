import './index.css'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { ReactNode } from 'react'
import React from 'react'

import type { ThreadableMessage } from '../../../types'

interface ActionProps {
  label: string
  message: ThreadableMessage
  icon: ReactNode
  onClick: (message: ThreadableMessage) => void
}

export default function Action(props: ActionProps) {
  return (
    <Tooltip title={props.label}>
      <IconButton
        data-cy={`${props.label.toLowerCase().replace(' ', '-')}-button`}
        color="inherit"
        aria-label={props.label}
        onClick={(
          event:
            | React.MouseEvent<HTMLAnchorElement>
            | React.MouseEvent<HTMLButtonElement>
        ) => {
          event.stopPropagation()
          event.preventDefault()
          props.onClick(props.message)
        }}
        className="rustic-message-actions"
      >
        {props.icon}
      </IconButton>
    </Tooltip>
  )
}
