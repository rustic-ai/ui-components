import type { MermaidConfig } from 'mermaid'
import type { Renderers } from 'vega'
import type { EmbedOptions, VisualizationSpec } from 'vega-embed'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageData = { [key: string]: any }

export interface Sender {
  id: string
  name: string
}

export interface Message {
  id: string
  timestamp: string
  sender: Sender
  conversationId: string
  format: string
  data: MessageData
  inReplyTo?: string
  threadId?: string
  priority?: string
  taggedParticipants?: string[]
  topic?: string
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

//VegaLite's typescript doesn't recognize font as a valid props
type VegaLiteOptions = EmbedOptions<string, Renderers> & {
  config?: EmbedOptions['config'] & {
    font?: string
  }
}

export interface VegaLiteFormat extends DataFormat {
  /** Follow Vega-lite's [documentation](https://vega.github.io/vega-lite/) to provide a specification object. Schema should be included in the spec. Need to use 'container' for width or height for responsive chart. */
  spec: VisualizationSpec
  theme: {
    light?: VegaLiteOptions['theme']
    dark: VegaLiteOptions['theme']
  }
  options?: VegaLiteOptions
}

export type VegaLiteData = VegaLiteFormat & Updates<VegaLiteFormat>

export interface MermaidFormat extends DataFormat {
  /** Diagram definition following [Mermaid's syntax](https://mermaid.js.org/intro/syntax-reference.html#syntax-structure). The use of [these](https://mermaid.js.org/intro/syntax-reference.html#diagram-breaking) words or symbols can break diagrams. */
  diagram: string
  /** Configuration for altering and customizing Mermaid Diagrams. Refer [Mermaid docs](https://mermaid.js.org/config/schema-docs/config.html) for details. */
  config?: MermaidConfig
}

export type MermaidData = MermaidFormat & Updates<MermaidFormat>

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

export interface FileData {
  name: string
  url?: string
}

export interface MultipartFormat extends DataFormat {
  /** An array of file data. */
  files: FileData[]
  /** Text content sent along with the files. */
  text?: string
}

export type MultipartData = MultipartFormat & Updates<MultipartFormat>

export interface BaseInputProps {
  /** Current user. */
  sender: Sender
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

export interface UploaderProps {
  /** The types of files that are allowed to be selected for upload. For safety reasons, only allow file types that can be handled by your server. Avoid accepting executable file types like .exe, .bat, or .msi. For more information, refer to the [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers). */
  acceptedFileTypes: string
  /** The API endpoint where files will be uploaded. File id will be appended to the end of API endpoint. */
  uploadFileEndpoint: string
  /** The API endpoint to delete/cancel uploaded files. File id will be appended to the end of API endpoint. */
  deleteFileEndpoint: string
  /** Used in the API request to link the file with the message that's going to be sent. */
  messageId: string
  /** A function to handle changes in the file list. The parent component should use this to track file names and handle submit accordingly. */
  onFileUpdate: (action: 'add' | 'remove', fileName: string) => void
  /** Optional HTML div where the errors should be shown. */
  errorMessagesContainer?: HTMLDivElement
  /** Optional HTML div where the filePreviews should be shown. */
  filePreviewsContainer?: HTMLDivElement
  /** The maximum number of files that can be uploaded in one message. */
  maxFileCount?: number
  /** The maximum size for each uploaded file, in bytes. */
  maxFileSize?: number
}

export type MultimodalInputProps = TextInputProps &
  Omit<
    UploaderProps,
    | 'messageId'
    | 'onFileUpdate'
    | 'filePreviewsContainer'
    | 'errorMessagesContainer'
  >

export interface ConversationProps {
  /** WebSocket connection to send and receive messages to and from a backend. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. */
  ws: WebSocketClient
  /** Current user. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. */
  sender: Sender
  /** Id of the current conversation. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. */
  conversationId: string
  /** Id of the message. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`. */
  messageId: string
}

export interface QuestionFormat extends DataFormat {
  /** Array of options to choose from. */
  options: (string | number)[]
}

export interface QuestionProps extends QuestionFormat, ConversationProps {}
