/* eslint-disable no-magic-numbers */

import Button from '@mui/material/Button'
import type { StoryFn } from '@storybook/react'
import React, { useState } from 'react'

import { ParticipantRole, ParticipantType } from '../types'
import ParticipantsContainer, {
  type ParticipantsContainerProps,
} from './participantsContainer'

export default {
  title: 'Rustic UI/Participants Container/Participants Container',
  component: ParticipantsContainer,
  tags: ['autodocs'],
  argTypes: {
    participants: {
      description:
        'A list of participants to be displayed. \n<pre>```interface Participant {\n  id: string\n  displayName: string\n  participantRole: ParticipantRole\n  participantType: ParticipantType\n}```</pre>',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `ParticipantsContainer` component is responsible for displaying a list of participants within a dialog window. It organizes participants into separate lists based on their type (human or agent) and provides options to toggle between showing a subset of participants and displaying the full list. This component enhances the user experience by presenting participant information in a structured format and allowing users to view additional details as needed. \n\nNote: The component does not include the button displayed to toggle between the two views. This button is typically implemented in the parent component that uses the `ParticipantsContainer` component.',
      },
    },
  },
  decorators: [
    (Story: StoryFn) => {
      const [isModalOpen, setIsModalOpen] = useState(false)

      const openModal = () => setIsModalOpen(true)
      const closeModal = () => setIsModalOpen(false)

      return (
        <>
          <Story
            args={{
              isParticipantListOpen: isModalOpen,
              onClose: closeModal,
            }}
          />

          <Button variant="outlined" onClick={openModal}>
            Open Participants Container
          </Button>
        </>
      )
    },
  ],
}

const createRandomParticipants = (numberOfParticipants: number) => {
  const participants = []
  for (let i = 0; i < numberOfParticipants; i++) {
    participants.push({
      id: `${i}`,
      displayName: `someUser${i}`,
      participantRole: i === 1 ? ParticipantRole.Owner : ParticipantRole.Member,
      participantType:
        i % 2 === 0 ? ParticipantType.Agent : ParticipantType.Human,
    })
  }

  return participants
}

export const Default = (args: ParticipantsContainerProps) => {
  return (
    <ParticipantsContainer
      participants={createRandomParticipants(4)}
      isParticipantListOpen={args.isParticipantListOpen}
      onClose={args.onClose}
    />
  )
}

export const OneParticipant = (args: ParticipantsContainerProps) => {
  return (
    <ParticipantsContainer
      participants={[
        {
          id: '1',
          displayName: 'Lonely User',
          participantRole: ParticipantRole.Owner,
          participantType: ParticipantType.Human,
        },
      ]}
      isParticipantListOpen={args.isParticipantListOpen}
      onClose={args.onClose}
    />
  )
}

export const ManyParticipants = (args: ParticipantsContainerProps) => {
  return (
    <ParticipantsContainer
      participants={createRandomParticipants(104)}
      isParticipantListOpen={args.isParticipantListOpen}
      onClose={args.onClose}
    />
  )
}

export const NoParticipants = (args: ParticipantsContainerProps) => {
  return (
    <ParticipantsContainer
      participants={[]}
      isParticipantListOpen={args.isParticipantListOpen}
      onClose={args.onClose}
    />
  )
}
