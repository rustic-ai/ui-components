import type { MessageSpaceProps } from './messageSpace/messageSpace'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageData = { [key: string]: any }

/** Represents a user or agent responsible for sending given message */
export interface Sender {
  /** id of the sender*/
  id: string
  /** name of the sender if available */
  name?: string
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

export interface ComponentMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>
}

export interface WebSocketClient {
  send: (message: Message) => void
  close: () => void
  reconnect: () => void
  onReceive?: (handler: (message: Message) => void) => void
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

export interface VisualizationFormat extends DataFormat {
  /** Alternative text for the visualization components used for assistive technology. */
  alt?: string
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

export interface LocationFormat extends VisualizationFormat {
  /** Longitude in decimal degrees. */
  longitude: number
  /** Latitude in decimal degrees. */
  latitude: number
  /** Optional title for the location. */
  title?: string
  /** Optional description for the location. */
  description?: string
}

export interface ImageFormat extends VisualizationFormat {
  /** Base64 encoded image or path to an image file. */
  src: string
  /** Width rendered in pixels. If neither width nor height are provided, the image will be set to be contained in the parent container. */
  width?: number
  /** Height rendered in pixels. */
  height?: number
}

export interface TableHeader {
  /** Field in table data for this header. */
  dataKey: string
  /** Optional label for this header. */
  label?: string
}

export type TableSortOption = 'asc' | 'desc' | 'col asc' | 'col desc'

export type TableAggregateOption =
  | 'abs sum'
  | 'and'
  | 'any'
  | 'avg'
  | 'count'
  | 'distinct count'
  | 'distinct leaf'
  | 'dominant'
  | 'first'
  | 'high'
  | 'last'
  | 'low'
  | 'or'
  | 'median'
  | 'pct sum parent'
  | 'pct sum grand total'
  | 'stddev'
  | 'sum'
  | 'sum abs'
  | 'sum not null'
  | 'unique'
  | 'var'
  | ['weighted mean', string]

export type TableSort = [string, TableSortOption]

export type FilterOperation =
  | '<'
  | '>'
  | '<='
  | '>='
  | '=='
  | '!='
  | 'is null'
  | 'is not null'
  | 'in'
  | 'not in'
  | 'begins with'
  | 'contains'

export type TableFilter = [
  string,
  FilterOperation,
  string | number | Date | boolean | Array<string | number | Date | boolean>,
]

export type TableConfig = {
  columns?: string[]
  groupBy?: string[]
  splitBy?: string[]
  aggregates?: { [columnName: string]: TableAggregateOption }
  sort?: TableSort[]
  filter?: TableFilter[]
}

export interface TableFormat extends VisualizationFormat {
  /** Data to be displayed in the table. */
  data: Array<Record<string, string | number>>
  /** Optional array to set the order of columns and assign labels.
   * This can also be used to limit which columns are shown. */
  headers?: TableHeader[]
  /** Optional object to define how the data should be displayed, grouped, sorted, filtered, and aggregated within the table. */
  config?: TableConfig
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

export interface MultipartProps extends MultipartData {
  /**
   * An object mapping file extensions to their respective viewer components.
   * Each key represents a file type (e.g., 'pdf', 'jpg'), and the corresponding value is a React component
   * that takes a `url` prop and renders the appropriate viewer for that file type. This prop is used to decide
   * which viewer component should be used to open and display the file within the modal.
   */
  supportedViewers?: { [key: string]: React.ComponentType<{ url: string }> }
}

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
  /** Specifies the maximum number of emoji search results to display when the user enters a search query. The search query is triggered when the user types in a format like `:text`. */
  maximumEmojiSearchResults?: number
}

export interface TextInputProps
  extends Omit<BaseInputProps, 'send' | 'isSendEnabled'> {
  /** WebSocket connection to send and receive messages to and from a backend.*/
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

export interface PDFViewerProps {
  /** The url of the PDF file to be displayed. */
  url: string
}

export interface Weather {
  timestamp: number
  temp: {
    low: number
    high: number
    current?: number
  }
  weatherIcon: {
    icon: string
    description: string
  }
}

export interface WeatherFormat extends DataFormat {
  /** Array of daily weather data. */
  weather: Weather[]
  /** The location from which the weather data is from. */
  location: string
  /** The temperature units of the weather data. */
  units: 'metric' | 'imperial'
}

export type WeatherData = WeatherFormat & Updates<WeatherFormat>

export interface WeatherProps extends WeatherData {
  weatherProvider?: string
}

export interface PromptBuilderProps
  extends Omit<
    MessageSpaceProps,
    'getActionsComponent' | 'scrollDownLabel' | 'messages'
  > {
  /** Message id of the message that invokes the PromptBuilder. It is optional and intended to support the use of threads in your application, should you choose to implement them. All interactions within a PromptBuilder session are considered part of a single thread. In this component, the collected user inputs are submitted as messages to the server, with the `threadId` field of those messages set to this message id. This marks the message invoking the PromptBuilder as the parent message of the thread. Refer to the `MessageSpace` documentation to read more about `Message` interface. */
  messageId?: string
  /** Function called when the user clicks on the "Generate" button. At this point, the conversation within the prompt builder will cease. Provide your custom logic to dictate what happens next and where the generated prompt will be displayed. */
  onSubmit: () => void
  /** Function called when quitting the prompt builder. A confirmation modal will appear when the user clicks on the "Quit" button. The user will be given an option to quit or continue building the prompt. The function will be called upon confirmation of quitting. */
  onCancel: () => void
}
