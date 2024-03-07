import type { StoryFn } from '@storybook/react'
import React from 'react'

import Image from './image'

export default {
  title: 'Rustic UI/Image/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `Image` component facilitates the display of images, providing loading indication and error handling capabilities. It supports customization of image dimensions and alternative text, ensuring accessibility and a seamless user experience. Supported image formats: jpeg, png, gif, svg, webp, AVIF, APNG.',
      },
    },
  },
}

export const Default = {
  args: {
    url: 'https://assets-global.website-files.com/629d4351d174c60f32a4141a/647bfa926280c5b1cbccd03b_dragonscale_full_colour_rgb_icon_logo-p-500.png',
  },
}

export const InsideSmallerParentContainer = {
  args: {
    url: 'https://assets-global.website-files.com/629d4351d174c60f32a4141a/647bfa926280c5b1cbccd03b_dragonscale_full_colour_rgb_icon_logo-p-500.png',
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ width: '200px' }}>
          <Story />
        </div>
      )
    },
  ],
}

export const CustomizedWidthAndHeight = {
  args: {
    url: 'https://assets-global.website-files.com/629d4351d174c60f32a4141a/647bfa926280c5b1cbccd03b_dragonscale_full_colour_rgb_icon_logo-p-500.png',
    width: '100px',
    height: '100px',
    alt: 'Dragonscale logo',
  },
}

export const WrongUrl = {
  args: {
    url: 'wrongUrl.jpg',
  },
}
