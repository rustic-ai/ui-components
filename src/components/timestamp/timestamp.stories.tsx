import Timestamp from './timestamp'

export default {
  title: 'Rustic UI/Timestamp/Timestamp',
  component: Timestamp,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `Timestamp` component is responsible for displaying a timestamp in a visually consistent and formatted manner. It takes an ISO 8601 formatted timestamp as input and utilizes helper functions to format and render the timestamp.',
      },
    },
  },
}

function getYesterdayDate() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  return yesterday
}

const yesterday = getYesterdayDate()
const now = new Date()

export const Default = {
  args: {
    timestamp: '2023-11-26T23:25:44Z',
  },
}

export const OverADayAgo = {
  args: {
    timestamp: yesterday,
  },
}

export const NotThisYear = {
  args: {
    timestamp: '2022-11-26T23:25:44Z',
  },
}

export const TimeAgo = {
  args: {
    timestamp: now,
  },
}
