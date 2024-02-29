// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageData = { [key: string]: any }

export interface MessageProps {
  id: string
  timestamp: string
  sender: string
  conversationId: string
  format: string
  data: MessageData
  inReplyTo?: string
  threadId?: string
  priority?: string
  taggedParticipants?: string[]
  topicId?: string
}

export interface ThreadableMessage extends MessageProps {
  lastThreadMessage?: MessageProps
  threadMessagesData?: MessageData[]
}

export interface ComponentMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>
}

export interface WebSocketClient {
  send: (message: MessageProps) => void
  close: () => void
  reconnect: () => void
}

export enum ParticipantRole {
  Owner = 'owner',
  Member = 'member',
}

export enum ParticipantType {
  Human = 'human',
  Agent = 'agent',
}

export interface Participant {
  id: string
  displayName: string
  participantRole: ParticipantRole
  participantType: ParticipantType
}

export interface TextProps {
  text: string
}

export interface UpdateableText extends TextProps {
  updatedData?: { text: string }[]
}
