import './table.css'

import Box from '@mui/material/Box'
import { default as MuiTable } from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

import { capitalizeFirstLetter } from '../helper'
import type { TableData, TableHeader } from '../types'

export default function Table(props: TableData) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(
    props.rowsPerPageOptions ? props.rowsPerPageOptions[0] : -1
  )

  if (props.data.length === 0) {
    return <Typography variant="body2">No data available</Typography>
  }

  const dataKeys = Array.from(
    new Set(props.data.flatMap((rowData) => Object.keys(rowData)))
  )
  const headers: TableHeader[] =
    props.headers || dataKeys.map((key) => ({ dataKey: key }))

  const dataToDisplay =
    rowsPerPage > 0
      ? props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : props.data

  function handleChangePage(event: unknown, newPage: number) {
    setPage(newPage)
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

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
      <TableContainer className="rustic-table-container">
        <MuiTable
          aria-label={props.title || 'a table of data'}
          size="small"
          stickyHeader
        >
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
            {dataToDisplay.map((rowData, rowIndex) => (
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
      {props.rowsPerPageOptions && (
        <TablePagination
          className="rustic-table-pagination"
          data-cy="table-pagination"
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={props.rowsPerPageOptions}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Box>
  )
}
