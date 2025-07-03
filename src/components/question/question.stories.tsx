import Typography from '@mui/material/Typography'
import type { Meta, StoryFn } from '@storybook/react-webpack5'
import React, { useState } from 'react'

import Icon from '../icon/icon'
import MessageCanvas from '../messageCanvas/messageCanvas'
import { optionalWsDescription, senderDescription } from '../sharedDescription'
import Text from '../text/text'
import type { Message } from '../types'
import Question from './question'

const meta: Meta<React.ComponentProps<typeof Question>> = {
  title: 'Rustic UI/Question/Question',
  component: Question,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ maxWidth: '400px' }}>
          <Story />
        </div>
      )
    },
  ],
}

meta.argTypes = {
  ws: optionalWsDescription,
  sender: senderDescription,
}

export default meta

const options = ['Yes', 'Maybe', 'No']

const agent = { name: 'Some Agent', id: 't671hjlk' }
const user = { name: 'Some User', id: 'gahjqj19' }

function getProfileIconAndName(name: string) {
  return (
    <>
      {name.toLowerCase().includes('agent') ? (
        <Icon name="smart_toy" />
      ) : (
        <Icon name="account_circle" />
      )}
      <Typography variant="body1" color="text.secondary">
        {name}
      </Typography>
    </>
  )
}

export const Default = {
  args: {
    sender: agent,
    conversationId: '1',
    messageId: '1',
    title: 'What do you think?',
    description: 'Choose either of the options below.',
    options,
    ws: {
      send: () => {},
    },
  },
}

export const InMessageSpace = {
  decorators: [
    (Story: StoryFn) => {
      const [selectedOption, setSelectedOption] = useState('')

      return (
        <div style={{ maxWidth: '400px' }}>
          <MessageCanvas
            message={{
              id: '1',
              sender: agent,
              timestamp: new Date().toISOString(),
              conversationId: '1',
              format: 'question',
              data: {},
            }}
            getProfileComponent={() => getProfileIconAndName(agent.name)}
          >
            <Story
              args={{
                ...Default.args,
                ws: {
                  send: (selection: Message) => {
                    return setSelectedOption(
                      selection.data.messages[0].content[0].text
                    )
                  },
                },
              }}
            />
          </MessageCanvas>
          {selectedOption.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <MessageCanvas
                message={{
                  id: '2',
                  sender: user,
                  timestamp: new Date().toISOString(),
                  conversationId: '1',
                  format: 'chatCompletionRequest',
                  data: {
                    messages: [
                      {
                        content: { type: 'text', text: selectedOption },
                        role: 'user',
                      },
                    ],
                  },
                }}
                getProfileComponent={() => getProfileIconAndName(user.name)}
              >
                <Text text={selectedOption} />
              </MessageCanvas>
            </div>
          )}
        </div>
      )
    },
  ],
}

export const ReadOnly = {
  args: {
    sender: agent,
    conversationId: '2',
    messageId: '1',
    title: 'What do you think?',
    description: 'Choose either of the options below.',
    options,
  },
}
