import './fCCalendar.css'

import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React from 'react'

import type { CalendarData } from '../types'

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
        events={props.events}
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
