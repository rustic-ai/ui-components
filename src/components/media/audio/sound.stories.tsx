import Sound from './sound'

export default {
  title: 'Rustic UI/Audio/Sound',
  component: Sound,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `Sound` component is an audio player designed for playing sound files in web applications. It provides controls for playback, volume adjustment, and playback rate modification. The component is suitable for embedding audio content with accompanying transcripts, making it accessible and user-friendly.',
      },
    },
  },
}

const soundSrc = [
  'https://cdn.uppbeat.io/audio-files/9522211dcb40a5f6f421199a416268d2/489ebd7efd2c5d966ef63c0c0a1f89f2/8abb2d49069f14e2d1609e244bbd9709/STREAMING-waves-alexander-plam-main-version-16612-02-14.mp3',
]

export const Default = {
  args: {
    src: soundSrc,
    title: 'Sound Title',
    transcript: 'If a transcript is provided, it will be displayed here.',
  },
}

export const WithoutTitleAndTranscript = {
  args: {
    src: soundSrc,
  },
}

export const WithCaptions = {
  args: {
    src: ['audioExamples/audio.mp3'],
    title: 'Sound with Captions',
    captions: ['audioExamples/captions.vtt'],
  },
}

export const Error = {
  args: {
    src: [''],
  },
}
