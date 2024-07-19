import { type Client, WebSocket } from 'mock-socket'
import { v4 as getUUID } from 'uuid'

import type { Message, MessageData, WebSocketClient } from '../types'

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
  let ws = new WebSocket(webSocketUrl)

  return {
    send: (message: Message) => {
      ws.send(JSON.stringify(message))
    },
    close: () => {
      ws.close()
    },
    reconnect: () => {
      if (ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket(webSocketUrl)
      }
    },
    onReceive: (handler: (event: MessageEvent) => void) => {
      ws.onmessage = handler
    },
  }
}
