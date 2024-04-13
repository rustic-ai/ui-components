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
        <div style={{ width: '600px' }}>
          <Story />
        </div>
      )
    },
  ],
}

function getRandomDelayInSeconds(maxSeconds: number) {
  const conversionRate = 1000
  const minDelay = 1000
  const maxDelay = maxSeconds * conversionRate
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
}

function onFileAdd(_file: File, fileId: string): Promise<{ url: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ url: `https://example.com/${fileId}` })
    }, getRandomDelayInSeconds(1))
  })
}

function onFileAddFailed(): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const error = { response: { status: 500 } }
      reject(error)
    }, getRandomDelayInSeconds(1))
  })
}

function onFileAddRandomResult(
  _file: File,
  fileId: string
): Promise<{ url: string }> {
  const tenSeconds = 10
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const fiftyPercent = 0.5
      const shouldReject = Math.random() < fiftyPercent
      if (shouldReject) {
        const error = { response: { status: 500 } }
        reject(error)
      } else {
        resolve({ url: `https://example.com/${fileId}` })
      }
    }, getRandomDelayInSeconds(tenSeconds))
  })
}

function onFileDelete(fileId: string): Promise<{ isDeleted: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ isDeleted: true })
      // eslint-disable-next-line no-console
      console.log('File deleted:', fileId)
    }, getRandomDelayInSeconds(1))
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

export const RandomUploadResult = {
  args: {
    sender: 'You',
    conversationId: '1',
    placeholder: 'Type your message',
    ws: {
      // eslint-disable-next-line no-console
      send: (message: any) => console.log('Message sent:', message),
    },
    onFileAdd: onFileAddRandomResult,
    onFileDelete,
  },
}

export const SmallFilesOnly = {
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
