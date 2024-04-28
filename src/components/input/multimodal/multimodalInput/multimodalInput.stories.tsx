import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import MultimodalInput from './multimodalInput'

const meta: Meta<React.ComponentProps<typeof MultimodalInput>> = {
  title: 'Rustic UI/Input/Multimodal Input',
  component: MultimodalInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `MultimodalInput` component is a versatile form element that facilitates various types of user input. In addition to supporting text input, it empowers users to upload files seamlessly and efficiently. Designed to be flexible and adaptable, the `MultimodalInput` component serves as a foundation for accommodating diverse input requirements.',
      },
    },
    mockData: [
      {
        url: 'http://localhost:8080/upload/message?id=1',
        method: 'POST',
        status: 200,
        response: { fileId: '1' },
        delay: 1000,
      },
      {
        url: 'http://localhost:8080/files/file?message-id=1&file-id=:fileId',
        method: 'DELETE',
        status: 200,
        response: { message: 'Delete successfully!' },
        delay: 500,
      },
    ],
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ width: '600px' }}>
          <Story />
        </div>
      )
    },
  ],
}

meta.argTypes = {
  ws: {
    description:
      'WebSocket connection to send and receive messages to and from a backend.',
    table: {
      type: {
        summary: 'WebSocketClient.\n',
        detail:
          'send: (message: Message) => void\nclose: () => void\nreconnect: () => void\n',
      },
    },
  },
  sender: {
    description: 'The sender of the message.',
    table: {
      type: { summary: 'string' },
    },
  },
  conversationId: {
    description: 'Id of the current conversation.',
    table: {
      type: { summary: 'string' },
    },
  },
  uploadFileEndpoint: {
    description:
      'The API endpoint where files will be uploaded. File id will be appended to the end of API endpoint.',
    table: {
      type: { summary: 'string' },
    },
  },
  deleteFileEndpoint: {
    description:
      'The API endpoint to delete/cancel uploaded files. File id will be appended to the end of API endpoint.',
    table: {
      type: { summary: 'string' },
    },
  },
  acceptedFileTypes: {
    description:
      'The types of files that are allowed to be selected for upload. For safety reasons, only allow file types that can be handled by your server. Avoid accepting executable file types like .exe, .bat, or .msi. For more information, refer to the [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers).',
    table: {
      type: { summary: 'string' },
    },
  },
  label: {
    description:
      'Optional label text to be displayed in the input, which will then move to the top when the input is focused on. If both label and placeholder are provided, the placeholder will only be visible once the input is focused on.',
    table: {
      type: { summary: 'string' },
    },
  },
  placeholder: {
    description:
      'Optional Placeholder text to be displayed in the input before user starts typing.',
    table: {
      type: { summary: 'string' },
    },
  },
  multiline: {
    description:
      'Optional boolean that dictates whether `TextInput` can expand to be multiline.',
    table: {
      type: { summary: 'boolean' },
    },
  },
  maxRows: {
    description: 'Optional maximum number of rows to be displayed.',
    table: {
      type: { summary: 'number' },
    },
  },
  fullWidth: {
    description:
      'Optional boolean that dictates whether `TextInput` takes up 100% width of the parent container.',
    table: {
      type: { summary: 'boolean' },
    },
  },
  enableSpeechToText: {
    description:
      'Optional boolean to enable speech-to-text. See which browsers are supported [here](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility).',
    table: {
      type: { summary: 'boolean' },
    },
  },
  maxFileCount: {
    description:
      'Optional props. Maximum number of files that can be uploaded in one message.',
    table: {
      type: { summary: 'number' },
    },
  },
  maxFileSize: {
    description:
      'Optional props. The maximum size for each uploaded file, in bytes.',
    table: {
      type: { summary: 'number' },
    },
  },
}

export default meta

export const Default = {
  args: {
    sender: 'You',
    conversationId: '1',
    placeholder: 'Type your message',
    ws: {
      // eslint-disable-next-line no-console
      send: (message: any) => console.log('Message sent:', message),
    },
    uploadFileEndpoint: 'http://localhost:8080/upload/',
    deleteFileEndpoint: 'http://localhost:6006/files/',
    acceptedFileTypes:
      'image/*,.pdf,.doc,.docx,application/x-iwork-pages-sffpages',
  },
}

export const PDFAndImageOnly = {
  args: {
    ...Default.args,
    acceptedFileTypes: 'image/*,.pdf',
  },
}

export const FailToUpload = {
  args: {
    sender: 'You',
    conversationId: '1',
    placeholder: 'Type your message',
    ws: {
      // eslint-disable-next-line no-console
      send: (message: any) => console.log('Message sent:', message),
    },
    uploadFileEndpoint: 'http://localhost:6006/upload/',
    deleteFileEndpoint: 'http://localhost:6006/files/',
  },
}

export const FileSizeCannotExceedOneMB = {
  args: {
    ...Default.args,
    maxFileSize: 1048576,
  },
}

export const AllowUploadThreeFilesMax = {
  args: {
    ...Default.args,
    maxFileCount: 3,
  },
}

export const SpeechToText = {
  args: {
    ...Default.args,
    enableSpeechToText: true,
  },
}
