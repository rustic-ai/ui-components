import type { StoryFn } from '@storybook/react'
import React from 'react'

import MessageCanvas from '../messageCanvas/messageCanvas'
import SoundPlayer from './soundPlayer'

export default {
  title: 'Rustic UI/Audio/Sound Player',
  component: SoundPlayer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `SoundPlayer` component is an audio player designed for playing sound files in web applications. It provides controls for playback, volume adjustment, and playback rate modification. The component is suitable for embedding audio content with accompanying transcripts, making it accessible and user-friendly.',
      },
    },
  },
}

const soundSrc =
  'https://cdn.uppbeat.io/audio-files/9522211dcb40a5f6f421199a416268d2/489ebd7efd2c5d966ef63c0c0a1f89f2/8abb2d49069f14e2d1609e244bbd9709/STREAMING-waves-alexander-plam-main-version-16612-02-14.mp3'

export const Default = {
  args: {
    src: soundSrc,
    title: 'The Audio Component',
    transcript:
      "If you'd like to provide a transcript, it would be displayed here.",
  },
}

export const WithoutTitleAndTranscript = {
  args: {
    src: soundSrc,
  },
}

export const InsideMessageCanvas = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <MessageCanvas
          message={{
            id: '1',
            timestamp: '2020-01-02T00:00:00.000Z',
            conversationId: 'lkd9vc',
            topicId: 'default',
            format: 'soundPlayer',
            sender: 'Some sender',
            data: {
              src: soundSrc,
            },
          }}
        >
          <Story />
        </MessageCanvas>
      )
    },
  ],
}

export const LoadingError = {
  args: {
    src: '',
  },
}
