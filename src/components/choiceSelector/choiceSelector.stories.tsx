import type { StoryFn } from '@storybook/react'
import React from 'react'

import ChoiceSelector from './choiceSelector'

export default {
  title: 'Rustic UI/Choice Selector/Choice Selector',
  component: ChoiceSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `ChoiceSelector` component provides a user interface for selecting one or more options from a list of choices. It is designed to facilitate interactive decision-making and response submission within a conversation or messaging context.',
      },
    },
  },
  argTypes: {
    ws: {
      description:
        'WebSocket connection to send and receive messages to and from a backend. \n<pre>```interface WebSocketClient {\n  send: (message: Message) => void\n  close: () => void\n  reconnect: () => void\n}```</pre>',
    },
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ maxWidth: '500px' }}>
          <Story />
        </div>
      )
    },
  ],
}

const choices = ['Accept', 'Ignore']

const multipleChoice = [
  'Strongly Agree',
  'Agree',
  'Undecided',
  'Disagree',
  'Strongly Disagree',
]

const multipleSelection = ['Tokyo', 'Seoul', 'London', 'New York City']

const conversationData = {
  sender: 'You',
  conversationId: '1',
  messageId: '1',
}

export const Default = {
  args: {
    ...conversationData,
    prompt:
      'This is an **optional** prompt for the choice selector. I support **markdown**! Choose either of the options *below*.\n\nDecisions, decisions!',
    choices,
  },
}

export const MultipleChoice = {
  args: {
    ...conversationData,
    choices: multipleChoice,
  },
}

export const MultipleSelection = {
  args: {
    ...conversationData,
    prompt: 'Select all that apply.',
    choices: multipleSelection,
    acceptsMultiple: true,
  },
}

export const AlreadySavedResponse = {
  args: {
    ...conversationData,
    prompt:
      'This example shows a choice selector with a previously saved response.',
    choices,
    savedResponse: [choices[0]],
  },
}

export const EmptyArray = {
  args: {
    ...conversationData,
    choices: [],
  },
}
