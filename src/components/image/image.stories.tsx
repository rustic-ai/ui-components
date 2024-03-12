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
    alt: 'A curved facade covered in white latticework',
    url: '/images/image-component-example.png',
  },
}

export const ImageWithDescription = {
  args: {
    url: '/images/image-component-example.png',
    alt: 'A curved facade covered in white latticework',
    description:
      'Lorem ipsum dolor sit amet consectetur. Aliquam vulputate sit non non tincidunt pellentesque varius euismod est. Lobortis feugiat euismod lorem viverra. Ipsum justo pellentesque.',
  },
}

export const InsideSmallerParentContainer = {
  args: {
    alt: 'A curved facade covered in white latticework',
    url: '/images/image-component-example.png',
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
    alt: 'A curved facade covered in white latticework',
    url: '/images/image-component-example.png',
    width: '100px',
    height: '100px',
  },
}

export const WrongUrl = {
  args: {
    alt: 'An image example',
    url: 'wrongUrl.jpg',
  },
}
