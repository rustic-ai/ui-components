import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { FileData, Message } from '../../../types'
import meta from '../../textInput/textInput.stories'
import MultimodalInput from './multimodalInput'

const multiModalInputMeta: Meta<React.ComponentProps<typeof MultimodalInput>> =
  {
    title: 'Rustic UI/Input/Multimodal Input',
    component: MultimodalInput,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
      mockData: [
        {
          url: 'http://localhost:8080/upload?message-id=:messageId',
          method: 'POST',
          status: 200,
          response: { fileId: getUUID() },
          delay: 1000,
        },
        {
          url: 'http://localhost:8080/files/:fileName',
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

multiModalInputMeta.argTypes = {
  ...meta.argTypes,
  conversationId: {
    description: 'Id of the current conversation.',
    table: {
      type: { summary: 'string' },
    },
  },
  uploadFileEndpoint: {
    description:
      'The API endpoint for sending a POST multipart-form request. If the JSON response includes a `fileId` property, it can be used to delete the file later. Path placeholders like `fileName` and `messageId`, will be automatically replaced with the actual file name and message ID.',
    table: {
      type: { summary: 'string' },
    },
  },
  deleteFileEndpoint: {
    description:
      'The API endpoint to send a DELETE request. Path placeholders like `fileName`, `fileId` and `messageId`, will be automatically replaced with the corresponding file name, file ID, and message ID.',
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
  showFullName: {
    description:
      'Optional props. Setting this to `true` will display long file names in full. If set to `false`, long names will be shortened.',
    table: {
      type: { summary: 'boolean' },
    },
  },
  getUploadData: {
    description:
      'Optional props. A function that can be used to define additional data to be sent along with the file upload.',
    table: {
      type: { summary: '(fileName: string) => { [key: string]: any }' },
    },
  },
}

export default multiModalInputMeta

export const Default = {
  args: {
    sender: { id: '17shblx8nxk', name: 'Some User' },
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
    uploadFileEndpoint: 'http://localhost:8080/upload?message-id=:messageId',
    deleteFileEndpoint: 'http://localhost:8080/files/fileName',
    acceptedFileTypes:
      'image/*,.pdf,.doc,.docx,application/x-iwork-pages-sffpages',
  },
}

export const PDFAndImageOnly = {
  args: {
    ...Default.args,
    acceptedFileTypes: 'image/*,.pdf',
    getUploadData: () => {
      return { userId: 'testUserId' }
    },
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
