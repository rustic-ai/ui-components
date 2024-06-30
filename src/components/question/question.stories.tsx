import Typography from '@mui/material/Typography'
import type { Meta, StoryFn } from '@storybook/react'
import React, { useState } from 'react'

import Icon from '../icon/icon'
import MessageCanvas from '../messageCanvas/messageCanvas'
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
  ws: {
    table: {
      type: {
        summary: 'WebSocketClient',
        detail:
          'send: (message: Message) => void\nclose: () => void\nreconnect: () => void\n',
      },
    },
  },
  sender: {
    table: {
      type: {
        summary: 'Sender',
        detail:
          'id: String representing sender id.\n' +
          'name: Optional string of sender name.',
      },
    },
  },
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
                  send: (selection: Message) =>
                    setSelectedOption(selection.data.text),
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
                  format: 'text',
                  data: {
                    text: selectedOption,
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
