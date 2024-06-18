import './perspectiveTable.css'
import '@finos/perspective-viewer'
import '@finos/perspective-viewer-datagrid'
import '@finos/perspective-viewer-d3fc'
import '@finos/perspective-viewer/dist/css/pro.css'
import '@finos/perspective-viewer/dist/css/pro-dark.css'

import perspective, { type ViewConfig } from '@finos/perspective'
import type { HTMLPerspectiveViewerElement } from '@finos/perspective-viewer'
import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Stack from '@mui/system/Stack'
import useTheme from '@mui/system/useTheme'
import React, { useEffect, useRef, useState } from 'react'

import type { TableConfig, TableData } from '../types'

export function transformTableData(
  originalData: Array<Record<string, string | number>>
) {
  return originalData.map((record) => {
    const newData: Record<string, Array<string | number>> = {}
    for (const [key, value] of Object.entries(record)) {
      newData[key] = [value]
    }
    return newData
  })
}

/**
The PerspectiveTable component is designed to display and process large datasets efficiently. It integrates with the [Perspective](https://perspective.finos.org/) library, enabling advanced features such as filtering, sorting, and aggregating data for enhanced data analysis and visualization.
 */
function PerspectiveTable(props: TableData) {
  if (props.data.length === 0) {
    return <Typography variant="body2">No data available.</Typography>
  }

  const viewerRef = useRef<HTMLPerspectiveViewerElement | null>(null)
  const rusticTheme: Theme = useTheme()
  const [hasError, setHasError] = useState<boolean>(false)
  const perspectiveTheme =
    rusticTheme.palette.mode === 'dark' ? 'Pro Dark' : 'Pro Light'

  function transformTableConfig(config: TableConfig): ViewConfig {
    const { groupBy, splitBy, ...rest } = config

    const transformedConfig = {
      ...rest,
      group_by: groupBy,
      split_by: splitBy,
    }

    return transformedConfig
  }
  const transformedConfig = props.config && transformTableConfig(props.config)

  useEffect(() => {
    const worker = perspective.worker()
    worker
      .table(transformTableData(props.data))
      .then((table) => {
        const viewer = viewerRef.current
        if (viewer) {
          viewer
            .load(table)
            .then(() => {
              return viewer.restore({
                ...transformedConfig,
                settings: false,
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
  }, [props.data])

  useEffect(() => {
    const viewer = viewerRef.current
    if (viewer) {
      viewer
        .getTable(true)
        .then((table) => {
          if (table) {
            return viewer.restore({
              theme: perspectiveTheme,
            })
          }
        })
        .catch(() => {
          setHasError(true)
        })
    }
  }, [perspectiveTheme])

  if (hasError) {
    return (
      <Typography variant="body2">Failed to create table from data.</Typography>
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
