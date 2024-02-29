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
    docs: {
      description: {
        component:
          'There are currently 2 text components available, `Text` and `StreamingText`.\n\nThe `Text` component renders text content in a simple and straightforward manner, without any additional features or capabilities. It is suitable for rendering static text that does not require dynamic updates or streams of text data.\n\nOn the other hand, the `StreamingText` component is designed to handle streams of text data, allowing for dynamic updates to the displayed text content. It supports real-time updates of text content through the `updatedData` attribute, enabling the continuous appending of new text data to the existing content.\n\n ' +
          'Tip: Use `Text` when displaying static content, and use `StreamingText` when its being updated dynamically and new content should be appended to existing content.',
      },
    },
  },
}

export const Default = {
  args: {
    text: "I'm a text component!",
  },
}
