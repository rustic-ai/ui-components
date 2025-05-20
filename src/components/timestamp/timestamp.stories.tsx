import type { Meta } from '@storybook/react'

import Timestamp from './timestamp'

const meta: Meta<React.ComponentProps<typeof Timestamp>> = {
  title: 'Rustic UI/Timestamp/Timestamp',
  component: Timestamp,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}
export default meta
function getYesterdayDate() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  return yesterday
}

const yesterday = getYesterdayDate()

export const Default = {
  args: {
    timestamp: '2023-11-26T23:25:44Z',
  },
}

export const ThisYear = {
  args: {
    timestamp: yesterday,
  },
}

export const NotThisYear = {
  args: {
    timestamp: '2022-11-26T23:25:44Z',
  },
}
