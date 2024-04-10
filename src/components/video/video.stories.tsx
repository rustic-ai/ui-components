import Video from './video'

export default {
  title: 'Rustic UI/Video/Video',
  component: Video,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "The `Video` component is a customizable video player that provides essential controls for playback, volume adjustment, fullscreen mode, and more. It offers a seamless viewing experience for users while allowing developers to easily integrate and customize the player to fit their application's needs.",
      },
    },
  },
}

const videoSrc = 'videoExamples/videoStorybook.mp4'

export const Default = {
  args: {
    src: videoSrc,
    title: 'Video Title',
    transcript:
      'This is a test transcript for the video component. It demonstrates the basic video playback functionality along with the volume slider and transcript toggle.',
  },
}

export const WithoutTitleAndTranscript = {
  args: {
    src: videoSrc,
  },
}

export const WithCaptions = {
  args: {
    src: 'videoExamples/videoCaptions.mp4',
    title: 'Sound with Captions',
    captions: 'audioExamples/captions.vtt',
  },
}

export const Error = {
  args: {
    src: '',
  },
}
