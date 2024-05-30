import './mermaidViz.css'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/system/useTheme'
import mermaid from 'mermaid'
import React, { useEffect, useRef, useState } from 'react'

import type { MermaidData } from '../../types'

/** The `MermaidViz` component leverages [Mermaid.js](https://mermaid.js.org/) to create dynamic and interactive diagrams, including flowcharts, sequence diagrams, class diagrams, and more. It is ideal for visualizing complex data and processes in a clear and structured manner. */
function MermaidViz(props: MermaidData) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const rusticTheme = useTheme()
  const mermaidTheme = rusticTheme.palette.mode === 'dark' ? 'dark' : 'neutral'
  const [errorMessage, setErrorMessage] = useState<string>()
  const [isProcessed, setIsProcessed] = useState<boolean>(false)

  useEffect(() => {
    if (mermaidRef.current) {
      mermaid.initialize({
        theme: mermaidTheme,
        themeVariables: { fontFamily: 'Inter' },
        ...props.config,
      })

      mermaid
        .run({
          querySelector: '.rustic-mermaid',
        })
        .then(() => {
          setIsProcessed(true)
          setErrorMessage('')
        })
        .catch(() => {
          setIsProcessed(true)
          setErrorMessage(
            'An error occurred while rendering the diagram. Please check the syntax.'
          )
        })
    }
  }, [mermaidTheme])

  if (errorMessage) {
    return <Typography variant="body2">{errorMessage}</Typography>
  } else {
    return (
      <Stack
        direction="column"
        className={`${!isProcessed ? 'rustic-invisible ' : ''}rustic-mermaid-container`}
        data-cy="mermaid-container"
      >
        {props.title && (
          <Typography variant="subtitle2">{props.title}</Typography>
        )}
        {props.description && (
          <Typography variant="caption">{props.description}</Typography>
        )}
        <div className="rustic-mermaid" ref={mermaidRef} key={mermaidTheme}>
          {props.diagram}
        </div>
      </Stack>
    )
  }
}

export default MermaidViz
