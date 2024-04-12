import type { StoryFn } from '@storybook/react'
import React from 'react'

import YoutubeVideo from './youtubeVideo'

export default {
  title: 'Rustic UI/Video/Youtube Video',
  component: YoutubeVideo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `YoutubeVideo` component enables the embedding of YouTube videos, providing a seamless playback experience.',
      },
    },
  },
}

const youtubeVideoId = 'MtN1YnoL46Q'

export const Default = {
  args: {
    youtubeVideoId,
  },
}

export const InsideSmallerParentContainer = {
  args: {
    youtubeVideoId,
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ width: '200px', height: '200px' }}>
          <Story />
        </div>
      )
    },
  ],
}

export const CustomizedWidthAndHeight = {
  args: {
    youtubeVideoId,
    height: 300,
    width: 300,
    title: 'My Video',
  },
}

export const InvalidUrl = {
  args: {
    youtubeVideoId: 'InvalidVideoId',
  },
}
