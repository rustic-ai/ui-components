import './messageSpace.css'

import Button from '@mui/material/Button'
import Box from '@mui/system/Box'
import React, { useEffect, useRef, useState } from 'react'

import ElementRenderer from '../elementRenderer/elementRenderer'
import MessageCanvas, {
  type MessageContainerProps,
} from '../messageCanvas/messageCanvas'
import type { ComponentMap, ThreadableMessage } from '../types'

export interface MessageSpaceProps extends MessageContainerProps {
  /** A component map contains message formats as keys and their corresponding React components as values. */
  supportedElements: ComponentMap
  messages?: ThreadableMessage[]
}

/**
 The `MessageSpace` component uses `MessageCanvas` and `ElementRenderer` to render a list of messages. It serves as a container for individual message items, each encapsulated within a `MessageCanvas` for consistent styling and layout. \n\n Note: For more information about the `getActionsComponent` and `getProfileComponent` fields, refer to the [MessageCanvas' docs](http://localhost:6006/?path=/docs/rustic-ui-message-canvas-message-canvas--docs).
 */
export default function MessageSpace(props: MessageSpaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isButtonShown, setIsButtonShown] = useState(false)

  function handleGoToBottom(behavior: ScrollBehavior) {
    messagesEndRef.current?.scrollIntoView({
      behavior: behavior,
    })
    setIsButtonShown(false)
  }

  useEffect(() => {
    handleGoToBottom('instant')

    const options = {
      root: document.querySelector('#message-space'),
      rootMargin: '16px',
      threshold: 1.0,
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setIsButtonShown(!entry.isIntersecting)
    }, options)

    const targetDiv = messagesEndRef.current
    targetDiv && intersectionObserver.observe(targetDiv)

    return () => {
      targetDiv && intersectionObserver.unobserve(targetDiv)
    }
  }, [])

  return (
    <Box
      id="message-space"
      data-cy="message-space"
      className="rustic-message-space"
    >
      {props.messages &&
        props.messages.length > 0 &&
        props.messages.map((message) => {
          return (
            <MessageCanvas
              key={message.id}
              message={message}
              getActionsComponent={props.getActionsComponent}
              getProfileComponent={props.getProfileComponent}
            >
              <ElementRenderer
                message={message}
                supportedElements={props.supportedElements}
              />
            </MessageCanvas>
          )
        })}
      <div ref={messagesEndRef}></div>
      {isButtonShown && (
        <Button
          data-cy="go-to-bottom-button"
          variant="contained"
          className="rustic-go-to-bottom-button"
          onClick={() => handleGoToBottom('smooth')}
        >
          Go to bottom
        </Button>
      )}
    </Box>
  )
}
