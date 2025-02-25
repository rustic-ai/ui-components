import type { InputType } from 'storybook/internal/types'

export const conversationIdDescription: InputType = {
  description:
    'Id of the current conversation. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`.',
  type: { name: 'string', required: true },
}

export const senderDescription: InputType = {
  description:
    'Current user. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`.',
  type: {
    name: 'object',
    value: {
      id: { name: 'string', required: true },
      name: { name: 'string', required: false },
    },
    required: true,
  },
  table: {
    type: {
      summary: 'Sender',
      detail:
        'id: String representing sender id.\n' +
        'name: Optional string of sender name.',
    },
  },
}

export const wsDescription: InputType = {
  description:
    'WebSocket connection to send and receive messages to and from a backend. The onReceive prop will override the default handler once it is set. If you need to use the WebSocket for purposes other than chat, you will need to create a separate WebSocket connection.',
  type: {
    name: 'object',
    value: {
      send: { name: 'function', required: true },
      close: { name: 'function', required: true },
      reconnect: { name: 'function', required: true },
      onReceive: { name: 'function', required: false },
    },
    required: true,
  },
  table: {
    type: {
      summary: 'WebSocketClient',
      detail:
        'A websocket client with supports the following methods:\n' +
        'send: (msg: Message) => void\n' +
        'close: () => void\n' +
        'reconnect: () => void\n' +
        'onReceive?: (handler: (message: Message) => void) => void',
    },
  },
}

export const participantDetail =
  'Each Participant has the following fields:\n' +
  ' id: String representing the unique identifier for a participant\n' +
  ' displayName: Name that is displayed for the participant\n' +
  ' participantType: Type of the participant. Could be `human` or `agent`. \n' +
  ' participantRole: Optional property. It specifies the role assigned to a participant. Could either be `owner` or `member`. The default value is `member`. \n' +
  " icon: Optional property. A URL for the participant's icon. \n"

export const getMembersDescription: InputType = {
  description:
    'Function to fetch the list of participants. The list of participants will be used in the mention feature. Should return a promise that resolves to an array of participants.',
  table: {
    type: {
      summary: '() => Promise<Participant[]>',
      detail: participantDetail,
    },
  },
}
