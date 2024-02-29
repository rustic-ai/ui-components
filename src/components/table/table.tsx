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

export type TableProps = {
  /** Data to be displayed in the table. */
  data: Array<Record<string, string | number>>
  /** Title of the table. If no title is provided, `aria-label` is defaults to "a table of data". */
  title?: string
  /** Description of the table. */
  description?: string
  /** Use this prop to set customized headers. If none is provided, headers will be taken from the keys of the data objects from the `data` prop array. */
  headers?: string[]
}

export default function Table(props: TableProps) {
  const dataKeys = Array.from(
    new Set(props.data.flatMap((rowData) => Object.keys(rowData)))
  )
  const headers = props.headers || dataKeys

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
                {headers.map((header, index) => {
                  return (
                    <TableCell key={`header-${index}`}>
                      {capitalizeFirstLetter(header)}
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {props.data.map((rowData, index) => {
              return (
                <TableRow key={`row-${index}`}>
                  {dataKeys.map((dataKey, dataIndex) => {
                    return (
                      <TableCell key={`cell-${index}x${dataIndex}`}>
                        {rowData[dataKey]}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  )
}
