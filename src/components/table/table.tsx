import './table.css'

import Box from '@mui/material/Box'
import { default as MuiTable } from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React from 'react'

import { capitalizeFirstLetter } from '../helper'

export interface TableHeader {
  dataKey: string
  label?: string
}

export type TableProps = {
  /** Data to be displayed in the table. */
  data: Array<Record<string, string | number>>
  /** Title of the table. If no title is provided, `aria-label` is defaults to "a table of data". */
  title?: string
  /** Description of the table. */
  description?: string
  headers?: TableHeader[]
}

export default function Table(props: TableProps) {
  if (props.data.length === 0) {
    return <Typography variant="body2">No data available</Typography>
  }

  const dataKeys = Array.from(
    new Set(props.data.flatMap((rowData) => Object.keys(rowData)))
  )
  const headers: TableHeader[] =
    props.headers || dataKeys.map((key) => ({ dataKey: key }))

  return (
    <Box className="rustic-table">
      {props.title && (
        <Typography
          variant="body1"
          data-cy="table-title"
          className="rustic-table-title"
        >
          {props.title}
        </Typography>
      )}
      {props.description && (
        <Typography variant="subtitle2" data-cy="table-description">
          {props.description}
        </Typography>
      )}
      <TableContainer>
        <MuiTable aria-label={props.title || 'a table of data'} size="small">
          {headers.length > 0 && (
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={`header-${index}`}>
                    {header.label || capitalizeFirstLetter(header.dataKey)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {props.data.map((rowData, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {headers.map((header, colIndex) => (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                    {rowData[header.dataKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  )
}
