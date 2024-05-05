import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { FileData, Message } from '../../../types'
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
          'The `MultimodalInput` component is a versatile form element that facilitates various types of user input. In addition to supporting text input, it empowers users to upload files seamlessly and efficiently. Designed to be flexible and adaptable, the `MultimodalInput` component serves as a foundation for accommodating diverse input requirements.\n\n**Explainaton of File Upload Process:**\n\nOnce the user selects files for upload, the `MultimodalInput` component validates each file against criteria set by props, such as maximum file count, maximum file size, and accepted file types. Only files that meet all criteria are sent to the `uploadFileEndpoint`.\n\nThe `messageId` parameter is appended to the `uploadFileEndpoint` URL to link uploaded files to the corresponding message on the server. Upon successful upload, the server returns a `url` and `fileId` for each file. The `url` will be used in the file download functionality, while the `fileId` is used for potential file deletion.\n\nTo delete a file, the client sends the fileId and messageId to the `deleteFileEndpoint`. This action unlinks the file from the associated message and removes it from the server. If deletion is triggered before the file is fully uploaded, the uploading task is aborted to prevent incomplete uploads.\n\nThe `MultimodalInput` component provides default error messages for uploading errors. However, you can augment these messages by passing additional information. Your custom error message will be appended to the default error message, providing more context for error resolution. Error messages that occur on deletion cannot be customized for now.',
      },
    },
    mockData: [
      {
        url: 'http://localhost:8080/upload?message-id=:messageId',
        method: 'POST',
        status: 200,
        response: { fileId: getUUID() },
        delay: 1000,
      },
      {
        url: 'http://localhost:8080/files?message-id=:messageId&file-id=:fileId',
        method: 'DELETE',
        status: 200,
        response: { message: 'Delete successfully!' },
        delay: 200,
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
      'The API endpoint to send a POST multipart-form request with query params - `message-id`. The JSON response should contain a `fileId` property which will be used for deleting the file later.',
    table: {
      type: { summary: 'string' },
    },
  },
  deleteFileEndpoint: {
    description:
      'The API endpoint to send a DELETE request with query params - `message-id` and `file-id`.',
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
      send: (message: Message) => {
        let fileMessage = ''
        let textMessage = ''
        if (message.data.files && message.data.files.length > 0) {
          const fileNames = message.data.files
            .map((file: FileData) => file.name)
            .join(', ')
          fileMessage = `File(s): ${fileNames}`
        }
        if (message.data.text) {
          textMessage = `Text content: ${message.data.text}`
        }
        alert(
          'Message sent!' +
            '\n' +
            textMessage +
            `${textMessage.length > 0 ? '\n' : ''}` +
            fileMessage
        )
      },
    },
    uploadFileEndpoint: 'http://localhost:8080/upload',
    deleteFileEndpoint: 'http://localhost:8080/files',
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
