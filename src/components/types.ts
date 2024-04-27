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

export interface DataFormat {
  /** Optional title. */
  title?: string
  /** Optional description. */
  description?: string
}

export interface Updates<T extends DataFormat> {
  /** @ignore */
  updatedData?: T[]
}

export interface TextFormat extends DataFormat {
  text: string
}

export type TextData = TextFormat & Updates<TextFormat>

export interface CodeFormat extends DataFormat {
  /** Code that will be displayed. */
  code: string
  /** Language type needs to be provided so that the right language extension can be used to format and highlight code.
   * If an unsupported language is used, the code snippet is still viewable. */
  language: string
}

export type CodeData = CodeFormat & Updates<CodeFormat>

export interface CalendarEvent {
  /** Start date and time of the event. */
  start: string
  /** End date and time of the event. */
  end: string
  /** Physical address or online link where the event is happening. */
  location?: string
  /** Title or Name of the event. */
  title?: string
  /** Detailed information about the event. */
  description?: string
  /** Indicator if the event lasts the entire day. */
  isAllDay?: boolean
}

export interface CalendarFormat extends DataFormat {
  events: CalendarEvent[]
}

export type CalendarData = CalendarFormat & Updates<CalendarFormat>

export interface LocationFormat extends DataFormat {
  /** Longitude in decimal degrees. */
  longitude: number
  /** Latitude in decimal degrees. */
  latitude: number
  /** Optional title for the location. */
  title?: string
  /** Optional description for the location. */
  description?: string
}

export interface ImageFormat extends DataFormat {
  /** Base64 encoded image or path to an image file. */
  src: string
  /** Width rendered in pixels. If neither width nor height are provided, the image will be set to be contained in the parent container. */
  width?: number
  /** Height rendered in pixels. */
  height?: number
  /** Alternative text for the image used for assistive technology. */
  alt?: string
}

export interface TableHeader {
  /** Field in table data for this header. */
  dataKey: string
  /** Optional label for this header. */
  label?: string
}

export interface TableFormat extends DataFormat {
  /** Data to be displayed in the table. */
  data: Array<Record<string, string | number>>
  /** Optional array to set the order of columns and assign labels.
   * This can also be used to limit which columns are shown. */
  headers?: TableHeader[]
}

export type TableData = TableFormat & Updates<TableFormat>

export interface MediaFormat extends DataFormat {
  /** URL of the media file to be played. */
  src: string
  /** URL of the WebVTT captions file (.vtt). */
  captions?: string
  /** Transcript of the media content. */
  transcript?: string
}

export interface AudioFormat extends MediaFormat {}

export interface VideoFormat extends MediaFormat {
  /** URL of an image to be shown while the video is downloading. If not provided, nothing is displayed until the first frame is available. */
  poster?: string
}

export interface BaseInputProps {
  /** Id of the current user. */
  sender: string
  /** Id of the current conversation. */
  conversationId: string
  /** Label text to be displayed in the input, which will then move to the top when the input is focused on. If both label and placeholder are provided, the placeholder will only be visible once the input is focused on. */
  label?: string
  /** Placeholder text to be displayed in the input before user starts typing. */
  placeholder?: string
  /** Boolean that dictates whether `TextInput` can expand to be multiline. */
  multiline?: boolean
  /** Maximum number of rows to be displayed. */
  maxRows?: number
  /** Boolean that dictates whether `TextInput` takes up 100% width of the parent container. */
  fullWidth?: boolean
  /** function to send the message */
  send: (message: Message) => void
  /** Additional condition to enable the send button. */
  isSendEnabled?: boolean
  /** Boolean to enable speech-to-text. See which browsers are supported [here](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility). */
  enableSpeechToText?: boolean
}

export interface TextInputProps
  extends Omit<BaseInputProps, 'send' | 'isSendEnabled'> {
  ws: WebSocketClient
}

export type MultimodalInputProps = TextInputProps &
  Omit<
    UploaderProps,
    | 'messageId'
    | 'handleFileCountChange'
    | 'filePreviewRef'
    | 'errorMessagesRef'
  >

export interface UploaderProps {
  /** The types of files that are allowed to be selected for upload. For safety reasons, only allow file types that can be handled by your server. Avoid accepting executable file types like .exe, .bat, or .msi. For more information, refer to the [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers). */
  acceptedFileTypes: string
  /** The API endpoint where files will be uploaded. File id will be appended to the end of API endpoint. */
  uploadFileEndpoint: string
  /** The API endpoint to delete/cancel uploaded files. File id will be appended to the end of API endpoint. */
  deleteFileEndpoint: string
  /** Used in the API request to link the file with the message that's going to be sent. */
  messageId: string
  /** A function to handle changes in the file count. Parent component should use this to track file count change and handle submit accordingly. */
  handleFileCountChange: (fileCountChange: 1 | -1) => void
  /** Define a ref in Uploader's parent container and add this ref to the div element where you want to display the error messages from the Uploader component. */
  errorMessagesRef?: HTMLDivElement | null
  /** Define a ref in Uploader's parent container and use this ref to display a collection of file previews from the Uploader component at the desired location within the parent container. */
  filePreviewRef?: HTMLDivElement | null
  /** The maximum number of files that can be uploaded in one message. */
  maxFileCount?: number
  /** The maximum size for each uploaded file, in bytes. */
  maxFileSize?: number
}

export interface FileInfo {
  id: string
  name: string
  loadingProgress: number
  abortController: AbortController
  fileId?: string
}
