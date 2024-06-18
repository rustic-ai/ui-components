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

import type {
  TableConfig,
  TableData,
  TableFilter,
  TableHeader,
  TableSort,
} from '../types'

function createHeaderMap(headers?: Array<TableHeader>): Record<string, string> {
  if (!headers) {
    return {}
  }

  return headers.reduce(
    (map, header) => {
      const { dataKey, label } = header
      map[dataKey] = label || dataKey
      return map
    },
    {} as Record<string, string>
  )
}

export function transformTableData(
  originalData: Array<Record<string, string | number>>,
  headers?: TableHeader[]
) {
  const headerMap = createHeaderMap(headers)
  return originalData.map((record) => {
    const newData: Record<string, Array<string | number>> = {}
    for (const [key, value] of Object.entries(record)) {
      const newKey = headerMap[key] || key
      newData[newKey] = [value]
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

  function formatFilterConfig(
    filter: Array<TableFilter>,
    headerMap: Record<string, string>
  ): Array<TableFilter> {
    return filter.map((filterItem) => {
      const filterColumn = headerMap[filterItem[0]] || filterItem[0]
      const filterOperation = filterItem[1]

      const filterValue = filterItem[filterItem.length - 1]
      return [filterColumn, filterOperation, filterValue]
    })
  }

  function transformTableConfig(config: TableConfig): ViewConfig {
    const { groupBy, splitBy, aggregates, sort, filter, columns } = config
    const headerMap = createHeaderMap(props.headers)

    const formattedSortConfig = sort?.map((sortItem) => {
      const sortColumn = headerMap[sortItem[0]] || sortItem[0]
      const sortDirection = sortItem[1]
      return [sortColumn, sortDirection] as TableSort
    })

    const formattedAggregates =
      aggregates &&
      Object.fromEntries(
        Object.entries(aggregates).map(([dataKey, aggregateOption]) => [
          headerMap[dataKey] || dataKey,
          aggregateOption,
        ])
      )
    const transformedConfig = {
      group_by: groupBy?.map((dataKey) => headerMap[dataKey] || dataKey),
      split_by: splitBy?.map((dataKey) => headerMap[dataKey] || dataKey),
      aggregates: formattedAggregates,
      sort: formattedSortConfig,
      filter: filter && formatFilterConfig(filter, headerMap),
      columns: columns?.map((dataKey) => headerMap[dataKey] || dataKey),
    }

    return transformedConfig
  }

  const transformedConfig = props.config && transformTableConfig(props.config)

  useEffect(() => {
    const worker = perspective.worker()
    worker
      .table(transformTableData(props.data, props.headers))
      .then((table) => {
        const viewer = viewerRef.current
        if (viewer) {
          viewer
            .load(table)
            .then(() => {
              return viewer.restore({
                ...transformedConfig,
                theme: perspectiveTheme,
              })
            })
            .catch(() => {
              setHasError(true)
            })
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
