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

export interface TimeSeriesDataset {
  timestamp: number
  [key: string]: number
}

export interface ChartSpacing {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export type TimeSeriesType = 'line' | 'bar' | 'area'

export type ChartColors = {
  [key: string]: {
    stroke: string
    fill: string
  }
}

export interface TimeSeriesFormat extends DataFormat {
  /** Data to be displayed in the time series chart. The first field is used as the x-axis field. We currently support formatting epoch timestamps and ISO date strings. Other data types will be displayed as given. */
  timeSeries: TimeSeriesDataset[]
  /** Used to customize chart colors. An object containing a predefined set of CSS Colors. Hex, RGB, cross-browser color names as well as other color methods (See https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) are supported. If not provided, default colors will be applied. */
  chartColors?: ChartColors
  /** Array of y-axis reference lines. */
  referenceLineYAxis?: number[]
  /** Array of y-axis reference line colors. Hex color codes and string colors are both supported for defining colors. If not provided, all lines default to grey. Skip providing a custom color for a certain y-axis by providing an empty string. */
  referenceLineColor?: string[]
  /** Array of y-axis reference line labels. Skip providing a custom label for a certain y-axis by providing an empty string. */
  referenceLineLabel?: string[]
  /** Array of y-axis reference line stroke widths. If not provided, all lines default to 1. Skip providing a custom stroke width for a certain y-axis by providing an empty string. */
  referenceLineStrokeWidth?: number[]
  /** Aspect ratio of the chart. */
  aspectRatio?: number
  /** Width of the chart in pixels. */
  width?: number
  /** Chart type toggle will be hidden if the value is true. */
  disableChartTypeToggle?: boolean
  /** Define the default chart type: `line`, `bar`, or `area`. */
  defaultChartType?: TimeSeriesType
  /** Minimum width of the chart in pixels. */
  minChartWidth?: number
  /** Maximum width of the chart in pixels. */
  maxHeight?: number
  /** Pass a function to format y-axis label. Make sure to use tooltipFormatter and yAxisTickFormatter together so that the numbers are uniform. */
  yAxisTickFormatter?: (value: number) => string
  /** Spacing around the chart container in pixels. Depending on the charting library, this field is used to add either padding or margin.*/
  chartSpacing?: ChartSpacing
}

export type TimeSeriesData = TimeSeriesFormat & Updates<TimeSeriesFormat>
