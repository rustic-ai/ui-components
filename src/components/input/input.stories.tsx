import type { StoryFn } from '@storybook/react'
import React from 'react'

import Input from './input'

export default {
  title: 'Rustic UI/Input/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `Input` component is a versatile form element that facilitates various types of user input. In addition to supporting text input, it empowers users to upload files seamlessly and efficiently. Designed to be flexible and adaptable, the Input component serves as a foundation for accommodating diverse input requirements.',
      },
    },
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ width: '80vw' }}>
          <Story />
        </div>
      )
    },
  ],
}

const responseDelayTime = 1000
function onFileAdd(_file: File, fileId: string): Promise<{ url: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ url: `https://example.com/${fileId}` })
    }, responseDelayTime)
  })
}

function onFileAddFailed(): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const error = { response: { status: 500 } }
      reject(error)
    }, responseDelayTime)
  })
}

function onFileDelete(fileId: string): Promise<{ isDeleted: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ isDeleted: true })
      // eslint-disable-next-line no-console
      console.log('File deleted:', fileId)
    }, responseDelayTime)
  })
}

export const Default = {
  args: {
    sender: 'You',
    conversationId: '1',
    placeholder: 'Type your message',
    ws: {
      // eslint-disable-next-line no-console
      send: (message: any) => console.log('Message sent:', message),
    },
    onFileAdd,
    onFileDelete,
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
    onFileAdd: onFileAddFailed,
    onFileDelete,
  },
}
