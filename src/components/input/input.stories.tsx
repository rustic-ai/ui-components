import type { StoryFn } from '@storybook/react'
import React from 'react'

import Input, { type FileInfo } from './input'

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

function onFileAddSuccess(
  file: File,
  fileId: string,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
  fileInfo: FileInfo
) {
  const signal = fileInfo.controller.signal
  const delayTime = 50
  let progress = 0
  const progressTotal = 100
  const progressIncrementRate = 5
  return new Promise((resolve) => {
    const listener = () => {
      clearTimeout(timer)
    }
    signal?.throwIfAborted()
    const timer = setInterval(() => {
      if (progress < progressTotal) {
        const incrementAmount = Math.random() * progressIncrementRate
        progress += incrementAmount
        onUploadProgress({
          loaded: progress,
          total: progressTotal,
        } as ProgressEvent)
      } else {
        signal?.removeEventListener('abort', listener)
        resolve({ url: `https://rustic/${fileId}` })
      }
    }, delayTime)
    signal?.addEventListener('abort', listener)
  })
}

function delayReject(ms: number, signal: AbortSignal) {
  return new Promise((resolve, reject) => {
    const listener = () => {
      clearTimeout(timer)
    }
    signal?.throwIfAborted()
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', listener)
      reject('failed to upload')
    }, ms)
    signal?.addEventListener('abort', listener)
  })
}

function onFileAddFailed(
  file: File,
  fileId: string,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
  fileInfo: FileInfo
) {
  const deplayTimeInSeconds = 5
  return delayReject(
    getRandomDelayInSeconds(deplayTimeInSeconds),
    fileInfo.controller.signal
  )
}

function onFileAddRandom(
  file: File,
  fileId: string,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
  fileInfo: FileInfo
) {
  const fiftyPercent = 0.5
  const shouldReject = Math.random() < fiftyPercent

  if (shouldReject) {
    return onFileAddSuccess(file, fileId, onUploadProgress, fileInfo)
  } else {
    return onFileAddFailed(file, fileId, onUploadProgress, fileInfo)
  }
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
    onFileAdd: onFileAddSuccess,
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
    onFileAdd: onFileAddRandom,
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
