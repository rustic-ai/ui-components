import { type Client, WebSocket } from 'mock-socket'
import { v4 as getUUID } from 'uuid'

import type { Message, MessageData, WebSocketClient } from './types'

const serverDelay = 500

// helper function for mock servers used in promptBuilder.cy.tsx and promptBuilder.stories.tsx
export function sendMessageToClient(
  socket: Client,
  format: string,
  data: MessageData
) {
  setTimeout(() => {
    const responseMessage: Message = {
      sender: { id: 'server', name: 'Server' },
      conversationId: 'conversation-id',
      id: getUUID(),
      timestamp: new Date().toISOString(),
      format,
      data,
    }
    socket.send(JSON.stringify(responseMessage))
  }, serverDelay)
}

export function getMockWebSocketClient(webSocketUrl: string): WebSocketClient {
  let ws: WebSocket | null = null
  const connect = (): WebSocket => {
    const socket = new WebSocket(webSocketUrl)
    socket.onopen = () => {}

    return socket
  }
  ws = connect()
  return {
    send: (message: Message) => {
      if (ws) {
        ws.send(JSON.stringify(message))
      }
    },
    close: () => {
      if (ws) {
        ws.close()
      }
    },
    reconnect: () => {
      if (ws && ws.readyState === WebSocket.CLOSED) {
        ws = connect()
      }
    },
    onReceive: (handler: (message: Message) => void) => {
      if (ws) {
        ws.onmessage = (event) => {
          const receivedMessage = JSON.parse(event.data)
          handler(receivedMessage)
        }
      }
    },
  }
}
