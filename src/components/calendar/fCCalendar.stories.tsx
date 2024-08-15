import type { Meta } from '@storybook/react'

import FCCalendar from './fCCalendar'

const meta: Meta<React.ComponentProps<typeof FCCalendar>> = {
  title: 'Rustic UI/Calendar/FC Calendar',
  component: FCCalendar,
  tags: ['autodocs'],
}

meta.argTypes = {
  ...meta.argTypes,
  events: {
    table: {
      type: {
        summary: 'Array of CalendarEvent.\n',
        detail:
          'Each CalendarEvent has the following fields:\n' +
          '  start: ISO8601 string representation of start date and time of the event.\n' +
          '  end: ISO8601 string representation of end date and time of the event.\n' +
          '  title: Optional string representing title or name of the event.\n' +
          '  location: Optional string of address or link where the event is happening.\n' +
          '  description: Optional string with information about the event.\n' +
          '  isAllDay: Optional boolean value indicating whether the event lasts the entire day.',
      },
    },
  },
}

export default meta

export const Default = {
  args: {
    events: [
      {
        start: '2024-02-07T10:00:00',
        end: '2024-02-07T12:00:00',
        title: 'Aquarium',
      },
      {
        start: '2024-02-07T12:00:00',
        end: '2024-02-07T14:00:00',
        title: 'Lunch',
      },
      {
        start: '2024-02-08T09:00:00',
        title: 'Niagara Falls',
      },
      {
        start: '2024-02-08T12:00:00',
        end: '2024-02-08T14:00:00',
        title: 'Lunch',
      },
      {
        start: '2024-02-09T14:00:00',
        end: '2024-02-09T16:00:00',
        title: 'Casa Loma',
      },
      {
        start: '2024-02-09T10:30:00',
        end: '2024-02-09T12:30:00',
        title: 'Royal Ontario Museum',
      },
    ],
  },
}

export const AllDayEvents = {
  args: {
    events: [
      {
        start: '2024-02-01T10:00:00',
        end: '2024-02-01T12:00:00',
        title: 'Aquarium',
      },
      {
        start: '2024-02-03T12:00:00',
        end: '2024-02-07T14:00:00',
        title: 'Niagara Falls',
        isAllDay: true,
      },
    ],
  },
}
