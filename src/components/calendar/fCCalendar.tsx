import './fCCalendar.css'

import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React from 'react'

import type { CalendarData, CalendarEvent } from '../types'

/** Convert CalendarEvent type to FullCalendar's Event type
 * https://fullcalendar.io/docs/event-object */
function transformEvent(event: CalendarEvent) {
  return {
    title: event.title ? event.title : '',
    start: event.start,
    end: event.end,
    allDay: event.isAllDay,
  }
}

/** The `FCCalendar` component integrates the [FullCalendar](https://fullcalendar.io/docs) library to provide a versatile and interactive calendar view for managing events. It allows users to view events across different time frames and provides features for navigation.
 *
 * FullCalendar libraries are not bundled, so please install the following packages using npm:
 *
 * ```typescript
 * npm i @fullcalendar/core @fullcalendar/daygrid @fullcalendar/react
 * ```
 *
 * **Note**: On mobile screens, the calendar will default to the day view, offering users a detailed perspective of events for the selected day. Conversely, on larger screens, such as desktops or tablets, the calendar will default to the month view, offering users an overview of events scheduled throughout the month. */
export default function FCCalendar(props: CalendarData) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  function getDefaultInitialView() {
    if (isDesktop) {
      return 'dayGridMonth'
    } else {
      return 'dayGridDay'
    }
  }

  return (
    <Box className="rustic-fc-calendar">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView={getDefaultInitialView()}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
        }}
        initialDate={props.events[0].start}
        events={props.events.map(transformEvent)}
        views={{
          dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'short' },
          },
          dayGridWeek: {},
          dayGridDay: {
            titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
          },
        }}
      />
    </Box>
  )
}
