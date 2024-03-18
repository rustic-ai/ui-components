// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageData = { [key: string]: any }

export interface Message {
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

export interface ThreadableMessage extends Message {
  lastThreadMessage?: Message
  threadMessagesData?: MessageData[]
}

export interface ComponentMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>
}

export interface WebSocketClient {
  send: (message: Message) => void
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

export interface DataFormat {}

export interface Updates<T extends DataFormat> {
  updatedData?: T[]
}

export interface TextFormat extends DataFormat {
  text: string
}

export type TextData = TextFormat & Updates<TextFormat>

export interface CodeFormat extends DataFormat {
  code: string
  language: string
}

export type CodeData = CodeFormat & Updates<CodeFormat>

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  location?: string
  description?: string
  isAllDay?: boolean
}
export interface CalendarFormat extends DataFormat {
  events: CalendarEvent[]
}

export type CalendarData = CalendarFormat & Updates<CalendarFormat>
