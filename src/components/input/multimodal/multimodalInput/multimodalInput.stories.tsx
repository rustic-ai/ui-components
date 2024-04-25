import type { StoryFn } from '@storybook/react'
import React from 'react'

import MultimodalInput from './multimodalInput'

const meta = {
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
        url: 'http://localhost:8080/upload',
        method: 'POST',
        status: 200,
        response: { url: 'https://example-file/1' },
        delay: 1000,
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
    uploadFileEndpoint: 'http://localhost:8080/upload',
    deleteFileEndpoint: 'http://localhost:6006/delete/',
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
    deleteFileEndpoint: 'http://localhost:6006/delete/',
  },
  parameters: {
    mockData: [
      {
        url: 'http://localhost:6006/upload/:id',
        method: 'POST',
        status: 500,
        response: { message: 'Please try again later.' },
        delay: 1000,
      },
    ],
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
