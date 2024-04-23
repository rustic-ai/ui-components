import type { StoryFn } from '@storybook/react'
import React from 'react'

import Upload from './upload'

const meta = {
  title: 'Rustic UI/Input/Upload',
  component: Upload,
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
        url: 'http://localhost:6006/upload/:id',
        method: 'POST',
        status: 200,
        response: { url: 'https://file/1' },
        delay: 1000,
      },
      {
        url: 'http://localhost:6006/file/:id',
        method: 'DELETE',
        status: 200,
        response: { url: 'https://file/1' },
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
    uploadFileEndpoint: 'http://localhost:6006/upload/',
    deleteFileEndpoint: 'http://localhost:6006/file/',
    acceptedFileTypes:
      'image/*,.pdf,.doc,.docx,application/x-iwork-pages-sffpages',
  },
}
