import { v4 as getUUID } from 'uuid'

import {
  FCCalendar,
  Image,
  MarkedMarkdown,
  MarkedStreamingMarkdown,
  OpenLayersMap,
  RechartsTimeSeries,
  StreamingText,
  Table,
  Text,
  YoutubeVideo,
} from '..'
import CodeSnippet from '../codeSnippet/codeSnippet'
import MessageSpace from './messageSpace'

export default {
  title: 'Rustic UI/Message Space/Message Space',
  component: MessageSpace,
  tags: ['autodocs'],
  argTypes: {
    supportedElements: {
      description:
        'An ComponentMap contains message formats as keys and their corresponding React components as values.`interface ComponentMap {[key: string]: React.ComponentType<any>}`',
    },
    messages: {
      description:
        'Messages to be displayed. Could have thread messages for the streaming components. `Interface MessageData { [key: string]: any }`\n\n<pre>```{\nInterface MessageProps {\n  id: string\n  timestamp: string\n  sender: string\n  conversationId: string\n  format: string\n  data: MessageData\n  inReplyTo?: string\n  threadId?: string\n  priority?: string;\n  taggedParticipants?: string[]\n  topicId?: string\n}\n\n```</pre><pre>```{\nInterface ThreadableMessage extends MessageProps {\n  lastThreadMessage?: MessageProps\n  threadMessagesData?: MessageData[]}```</pre>',
    },
    getActionsComponent: {
      description:
        'Message actions. For example, this could be a list of buttons for different actions (e.g. copy, delete, save, etc.)',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `MessageSpace` component uses `MessageCanvas` and `ElementRenderer` to render a list of messages. It serves as a container for individual message items, each encapsulated within a MessageCanvas for consistent styling and layout.',
      },
    },
  },
}

const conversationId = '1'

const agentMessageData = {
  id: getUUID(),
  sender: 'Agent',
  conversationId,
}

const humanMessageData = {
  id: getUUID(),
  sender: 'You',
  conversationId,
}

const timeSeriesData = [
  {
    timestamp: 1704096000000,
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    timestamp: 1704182400000,
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    timestamp: 1704268800000,
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    timestamp: 1704355200000,
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    timestamp: 1704441600000,
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
]

const code = `function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('JavaScript');`
const tableData = [
  {
    food: 'chocolate milk',
    calories: 219,
    carbs: 27.31,
    protein: 8.37,
    fat: 8.95,
  },
  {
    food: 'whole milk',
    calories: 165,
    carbs: 11.99,
    protein: 8.46,
    fat: 9.44,
  },
  {
    food: '2% skimmed milk',
    calories: 129,
    carbs: 12.38,
    protein: 8.51,
    fat: 5.1,
  },
  {
    food: '1% skimmed milk',
    calories: 108,
    carbs: 12.87,
    protein: 8.69,
    fat: 2.5,
  },
  {
    food: 'skim milk',
    calories: 88,
    carbs: 12.84,
    protein: 8.72,
    fat: 0.21,
  },
]

const chartColors = ['#648FFF', '#785EF0', '#DC267F', '#FE6100', '#FFB000']

export const Default = {
  args: {
    messages: [
      {
        ...humanMessageData,
        timestamp: '2024-01-02T00:00:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the markdown component?',
        },
      },
      {
        ...agentMessageData,
        timestamp: '2024-01-02T00:01:00.000Z',
        format: 'markdown',
        data: {
          text: '# Title\n\n---\n\n ## Subtitle\n\nThis is a paragraph. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n- This is an **inline notation**\n- This is a *inline notation*.\n- This is a _inline notation_.\n- This is a __inline notation__.\n- This is a ~~inline notation~~.\n\n```\nconst string = "Hello World"\nconst number = 123\n```\n\n> This is a blockquote.\n\n1. Item 1\n2. Item 2\n3. Item 3\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Item 1   | Item 2   | Item 3   |',
        },
      },
      {
        ...humanMessageData,
        timestamp: '2024-01-02T00:02:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the time series component?',
        },
      },
      {
        ...agentMessageData,
        timestamp: '2024-01-02T00:03:00.000Z',
        format: 'timeSeries',
        data: {
          title: 'Demo Time Series Chart',
          timeSeries: timeSeriesData,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          yAxisLabelWidth: 60,
          chartColors,
        },
      },
      {
        ...humanMessageData,
        timestamp: '2024-01-02T00:04:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the calendar component?',
        },
      },
      {
        ...agentMessageData,
        timestamp: '2024-01-02T00:05:00.000Z',
        format: 'calendar',
        data: {
          events: [
            {
              id: '1',
              start: '2024-02-07T10:00:00',
              end: '2024-02-07T12:00:00',
              title: 'Aquarium',
            },
            {
              id: '2',
              start: '2024-02-07T12:00:00',
              end: '2024-02-07T14:00:00',
              title: 'Lunch',
            },
            {
              id: '3',
              start: '2024-02-08T09:00:00',
              title: 'Niagra Falls',
            },
            {
              id: '4',
              start: '2024-02-09T14:00:00',
              end: '2024-02-09T16:00:00',
              title: 'Casa Loma',
            },
            {
              id: '5',
              start: '2024-02-09T10:30:00',
              end: '2024-02-09T12:30:00',
              title: 'Royal Ontario Museum',
            },
          ],
        },
      },
      {
        ...humanMessageData,
        timestamp: '2024-01-02T00:06:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the table component?',
        },
      },
      {
        ...agentMessageData,
        timestamp: '2024-01-02T00:07:00.000Z',
        format: 'table',
        data: {
          title: 'Nutrient Data Comparison Across Various Types of Milk',
          description:
            'This table illustrates the variations in calories and nutrients for different types of milk, with measurements based on a serving size of 250 ml. Caloric values are expressed in kCal, and nutrient quantities are measured in grams. The data is sourced from the Canadian Nutrient File.',
          data: tableData,
        },
      },
      {
        ...humanMessageData,
        timestamp: '2024-01-02T00:08:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the video component?',
        },
      },
      {
        ...agentMessageData,
        timestamp: '2024-01-02T00:09:00.000Z',
        format: 'youtubeVideo',
        data: {
          width: '900px',
          height: '600px',
          youtubeVideoId: 'MtN1YnoL46Q',
        },
      },
      {
        ...humanMessageData,
        timestamp: '2024-01-02T00:10:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the image component?',
        },
      },
      {
        ...agentMessageData,
        timestamp: '2024-01-02T00:11:00.000Z',
        format: 'image',
        data: {
          url: '/images/image-component-example.png',
          alt: 'A curved facade covered in white latticework',
          description:
            'Lorem ipsum dolor sit amet consectetur. Aliquam vulputate sit non non tincidunt pellentesque varius euismod est. Lobortis feugiat euismod lorem viverra. Ipsum justo pellentesque.',
        },
      },
      {
        ...humanMessageData,
        timestamp: '2024-01-02T00:12:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the map component?',
        },
      },
      {
        ...agentMessageData,
        timestamp: '2024-01-02T00:13:00.000Z',
        format: 'map',
        data: {
          longitude: -123.1115,
          latitude: 49.2856,
        },
      },
      {
        ...humanMessageData,
        timestamp: '2024-01-02T00:14:00.000Z',
        format: 'text',
        data: {
          text: 'Could you show me an example of the code snippet component?',
        },
      },
      {
        ...agentMessageData,
        timestamp: '2024-01-02T00:15:00.000Z',
        format: 'codeSnippet',
        data: {
          code: code,
          language: 'javascript',
        },
      },
    ],
    supportedElements: {
      text: Text,
      streamingText: StreamingText,
      markdown: MarkedMarkdown,
      streamingMarkdown: MarkedStreamingMarkdown,
      image: Image,
      timeSeries: RechartsTimeSeries,
      map: OpenLayersMap,
      youtubeVideo: YoutubeVideo,
      table: Table,
      calendar: FCCalendar,
      codeSnippet: CodeSnippet,
    },
  },
}
