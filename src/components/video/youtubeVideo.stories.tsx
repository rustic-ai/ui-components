import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import YoutubeVideo from './youtubeVideo'

const meta: Meta<React.ComponentProps<typeof YoutubeVideo>> = {
  title: 'Rustic UI/Video/Youtube Video',
  component: YoutubeVideo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta

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
