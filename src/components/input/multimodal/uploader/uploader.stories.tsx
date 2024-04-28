import type { StoryFn } from '@storybook/react'
import React from 'react'

import Uploader from './uploader'

const meta = {
  title: 'Rustic UI/Input/Upload',
  component: Uploader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `Uploader` component simplifies file uploads with support for various file types, file preview, and deletion. Users can set constraints like max file size, count, and accepted types for precise control.',
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
    uploadFileEndpoint: 'http://localhost:8080/upload/',
    deleteFileEndpoint: 'http://localhost:8080/files/',
    acceptedFileTypes:
      'image/*,.pdf,.doc,.docx,application/x-iwork-pages-sffpages',
    messageId: 1,
    handleFileCountChange: () => {},
  },
}
