import Typography from '@mui/material/Typography'
import React from 'react'

import type { ComponentMap, ThreadableMessage } from '../types'

interface ElementRendererProps {
  message: ThreadableMessage
  supportedElements: ComponentMap
}

const ElementRenderer = (props: ElementRendererProps) => {
  const MaybeElement = props.supportedElements[props.message.format]

  function extractFormat(updateFormat: string) {
    const lettersInUpdate = 'update'.length
    const format = updateFormat
      .substring(0, updateFormat.length - lettersInUpdate)
      .trim()

    return format
  }

  const updateMessages = props.message.threadMessages?.filter(
    (threadMessage) =>
      threadMessage.sender === props.message.sender &&
      threadMessage.format.includes('Update') &&
      extractFormat(threadMessage.format) === props.message.format
  )

  const updatedData = updateMessages?.map((threadMessage) => threadMessage.data)

  return (
    <>
      {MaybeElement ? (
        React.createElement(MaybeElement, {
          ...props.message.data,
          ...(props.message.threadMessages && {
            updatedData: updatedData,
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
