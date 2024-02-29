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

export const Default = {
  args: {
    youtubeVideoId: 'MtN1YnoL46Q',
  },
}
export const Customized = {
  args: {
    youtubeVideoId: 'MtN1YnoL46Q',
    height: 200,
    width: 300,
    title: 'My Video',
  },
}
export const InvalidUrl = {
  args: {
    youtubeVideoId: 'InvalidVideoId',
  },
}
