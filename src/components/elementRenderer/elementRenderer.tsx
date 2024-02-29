import Typography from '@mui/material/Typography'
import React from 'react'

import type { ComponentMap, ThreadableMessage } from '../types'

interface ElementRendererProps {
  message: ThreadableMessage
  supportedElements: ComponentMap
}

const ElementRenderer = (props: ElementRendererProps) => {
  const MaybeElement = props.supportedElements[props.message.format]

  return (
    <>
      {MaybeElement ? (
        React.createElement(MaybeElement, {
          ...props.message.data,
          ...(props.message.threadMessagesData && {
            updatedData: props.message.threadMessagesData,
          }),
        })
      ) : (
        <Typography variant="body2">
          Unsupported element format: {props.message.format}
        </Typography>
      )}
    </>
  )
}

export default ElementRenderer
