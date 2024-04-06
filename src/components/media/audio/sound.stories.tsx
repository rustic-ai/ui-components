import Sound from './sound'

const meta = {
  title: 'Rustic UI/Audio/Sound',
  component: Sound,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `Sound` component is an audio player designed for playing audio files in web applications. It provides controls for playback, volume adjustment, and playback rate modification. The component is suitable for embedding audio content with accompanying transcripts, making it accessible and user-friendly.',
      },
    },
  },
}

export default meta

const soundSrc = 'audioExamples/audioStorybook.mp3'

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
    src: 'audioExamples/audioCaptions.mp3',
    title: 'Sound with Captions',
    captions: 'audioExamples/captions.vtt',
  },
}

export const Error = {
  args: {
    src: '',
  },
}
