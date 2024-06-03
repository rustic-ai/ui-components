import './mermaidViz.css'

import Stack from '@mui/material/Stack'
import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/system/useTheme'
import mermaid from 'mermaid'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as getUUID } from 'uuid'

import type { MermaidData } from '../../types'

/** The `MermaidViz` component leverages [Mermaid.js](https://mermaid.js.org/) to create dynamic and interactive diagrams, including flowcharts, sequence diagrams, class diagrams, and more. It is ideal for visualizing complex data and processes in a clear and structured manner. */
function MermaidViz(props: MermaidData) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState<string>()
  const rusticTheme: Theme = useTheme()
  const mermaidId = getUUID()

  useEffect(() => {
    const mermaidTheme =
      rusticTheme.palette.mode === 'dark' ? 'dark' : 'neutral'
    const defaultFont = rusticTheme.typography.fontFamily
    if (mermaidRef.current) {
      mermaid.initialize({
        theme: mermaidTheme,
        themeVariables: { fontFamily: defaultFont },
        ...props.config,
      })

      mermaid
        .render(`mermaid-svg-${mermaidId}`, props.diagram, mermaidRef.current)
        .then((result) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg
          }
          setErrorMessage('')
        })
        .catch(() => {
          mermaidRef.current?.replaceChildren()
          setErrorMessage('Failed to render the diagram.')
        })
    }
  })

  return (
    <Stack className={`rustic-mermaid-container`} data-cy="mermaid-container">
      {props.title && (
        <Typography variant="subtitle2">{props.title}</Typography>
      )}
      {props.description && (
        <Typography variant="caption">{props.description}</Typography>
      )}
      <div className="rustic-mermaid" ref={mermaidRef}></div>
      {errorMessage && <Typography variant="body2">{errorMessage}</Typography>}
    </Stack>
  )
}

export default MermaidViz
