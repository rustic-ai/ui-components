import Text from './text'

export default {
  title: 'Rustic UI/Text/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    text: {
      description: 'Text to be displayed.',
    },
    updatedData: {
      description:
        'New text to be appended to the existing text. This is only supported in the `StreamingText` component.\n`{ text: string }[]`',
      // Type added manually in description above as type below cannot recognize it
      // Empty type field below to avoid Storybook from showing "-" in place of the type for now
      type: {},
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export const Default = {
  args: {
    text: "I'm a text component!",
  },
}
