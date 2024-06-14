import './perspectiveTable.css'
import '@finos/perspective-viewer'
import '@finos/perspective-viewer-datagrid'
import '@finos/perspective-viewer-d3fc'
import '@finos/perspective-viewer/dist/css/pro.css'
import '@finos/perspective-viewer/dist/css/pro-dark.css'

import perspective from '@finos/perspective'
import type { HTMLPerspectiveViewerElement } from '@finos/perspective-viewer'
import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Stack from '@mui/system/Stack'
import useTheme from '@mui/system/useTheme'
import React, { useEffect, useRef, useState } from 'react'

import type { PerspectiveTableData } from '../types'

function PerspectiveTable(props: PerspectiveTableData) {
  const viewerRef = useRef<HTMLPerspectiveViewerElement | null>(null)
  const rusticTheme: Theme = useTheme()
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    const worker = perspective.worker()
    const perspectiveTheme =
      rusticTheme.palette.mode === 'dark' ? 'Pro Dark' : 'Pro Light'

    function load() {
      worker
        .table(props.data)
        .then((table) => {
          const viewer = viewerRef.current
          if (viewer) {
            viewer
              .load(table)
              .then(() => {
                return viewer.restore({
                  settings: false,
                  ...props.config,
                  theme: perspectiveTheme,
                })
              })
              .catch(() => {
                setHasError(true)
              })

            // Hide the settings button for now
            const shadowRoot = viewer.shadowRoot
            const settingsButton = shadowRoot?.querySelector(
              'div#settings_button'
            ) as HTMLElement
            if (settingsButton) {
              settingsButton.style.display = 'none'
            }
          }
        })
        .catch(() => {
          setHasError(true)
        })
    }

    load()
  }, [props.data])

  if (hasError) {
    return (
      <div className="rustic-perspective-viewer">
        <Typography variant="body2">
          Failed to create table from data.
        </Typography>
      </div>
    )
  } else {
    return (
      <Stack direction="column" className="rustic-perspective-viewer-container">
        {props.title && (
          <Typography variant="h6" data-cy="table-title">
            {props.title}
          </Typography>
        )}
        {props.description && (
          <Typography variant="body1" data-cy="table-description">
            {props.description}
          </Typography>
        )}
        <perspective-viewer
          ref={viewerRef}
          style={{
            fontFamily: rusticTheme.typography.fontFamily,
          }}
        ></perspective-viewer>
      </Stack>
    )
  }
}

export default PerspectiveTable
