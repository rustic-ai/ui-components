import FCCalendar from './fCCalendar'

export default {
  title: 'Rustic UI/Calendar/FC Calendar',
  component: FCCalendar,
  tags: ['autodocs'],
  argTypes: {
    events: {
      control: 'object',
      description:
        'An array of objects. Each object has details for an event. \n<pre>```interface Event:{\n  id: string\n  allDay?: boolean\n  start: string\n  end?: string\n  title: string\n}```</pre>',
    },
    initialView: {
      description:
        'The initial view to be displayed when the calendar is first loaded. It has three options: `dayGridMonth`, `dayGridWeek`, `dayGridDay`. Defaults to dayGridMonth on desktop and dayGridDay on mobile.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `FCCalendar` component integrates the [FullCalendar](https://fullcalendar.io/docs) library to provide a versatile and interactive calendar view for managing events. It allows users to view events across different time frames and provides features for navigation',
      },
    },
  },
}

export const Default = {
  args: {
    events: [
      {
        id: '1',
        start: '2024-02-07T10:00:00',
        end: '2024-02-07T12:00:00',
        title: 'Aquarium',
      },
      {
        id: '2',
        start: '2024-02-07T12:00:00',
        end: '2024-02-07T14:00:00',
        title: 'Lunch',
      },
      {
        id: '3',
        start: '2024-02-08T09:00:00',
        title: 'Niagra Falls',
      },
      {
        id: '4',
        start: '2024-02-09T14:00:00',
        end: '2024-02-09T16:00:00',
        title: 'Casa Loma',
      },
      {
        id: '5',
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
        id: '1',
        start: '2024-02-01T10:00:00',
        end: '2024-02-01T12:00:00',
        title: 'Aquarium',
        allDay: true,
      },
      {
        id: '2',
        start: '2024-02-03T12:00:00',
        end: '2024-02-07T14:00:00',
        title: 'Niagra Falls',
        allDay: true,
      },
    ],
  },
}
