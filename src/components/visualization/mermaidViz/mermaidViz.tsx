import './mermaidViz.css'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/system/useTheme'
import mermaid from 'mermaid'
import React, { useEffect, useRef } from 'react'

import type { MermaidData } from '../../types'

/** The `MermaidViz` component leverages [Mermaid.js](https://mermaid.js.org/) to create dynamic and interactive diagrams, including flowcharts, sequence diagrams, class diagrams, and more. It is ideal for visualizing complex data and processes in a clear and structured manner. */
function MermaidViz(props: MermaidData) {
  const chartRef = useRef(null)
  const rusticTheme = useTheme()
  const isDarkTheme = rusticTheme.palette.mode === 'dark'

  useEffect(() => {
    if (chartRef.current) {
      mermaid.initialize({
        theme: 'base',
        themeVariables: {
          primaryColor: rusticTheme.palette.primary.main,
          primaryTextColor: rusticTheme.palette.background.paper,
          primaryBorderColor: rusticTheme.palette.divider,
          lineColor: rusticTheme.palette.divider,
          secondaryColor: rusticTheme.palette.secondary.main,
          background: rusticTheme.palette.background.paper,
          errorTextColor: rusticTheme.palette.error.main,
          errorBkgColor: rusticTheme.palette.error.main,
          fontFamily: 'Inter',
        },
        ...props.config,
      })

      mermaid.contentLoaded()
    }
  }, [isDarkTheme])

  return (
    <Stack
      direction="column"
      className="rustic-mermaid-container"
      data-cy="mermaid-container"
    >
      {props.title && (
        <Typography variant="subtitle2">{props.title}</Typography>
      )}
      {props.description && (
        <Typography variant="caption">{props.description}</Typography>
      )}
      <div ref={chartRef} className="mermaid">
        {props.code}
      </div>
    </Stack>
  )
}

export default MermaidViz
