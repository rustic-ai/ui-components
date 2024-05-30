import './table.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Stack from '@mui/material/Stack'
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

const paginationThreshold = 10

export default function Table(props: TableData) {
  const isDataGreaterThanThreshold = props.data.length > paginationThreshold

  const [rowsPerPage, setRowsPerPage] = useState(
    isDataGreaterThanThreshold ? paginationThreshold : -1
  )
  const [currentPage, setCurrentPage] = useState(0)

  if (props.data.length === 0) {
    return <Typography variant="body2">No data available</Typography>
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const dataKeys = Array.from(
    new Set(props.data.flatMap((rowData) => Object.keys(rowData)))
  )
  const headers: TableHeader[] =
    props.headers || dataKeys.map((key) => ({ dataKey: key }))

  const dataToDisplay =
    rowsPerPage > 0
      ? props.data.slice(
          currentPage * rowsPerPage,
          currentPage * rowsPerPage + rowsPerPage
        )
      : props.data

  function handleChangePage(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) {
    setCurrentPage(newPage)
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value)
    setCurrentPage(0)
  }

  return (
    <Stack className="rustic-table" spacing={1}>
      {props.title && (
        <Typography
          variant="h6"
          data-cy="table-title"
          className="rustic-table-title"
        >
          {props.title}
        </Typography>
      )}
      {props.description && (
        <Typography variant="body1" data-cy="table-description">
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
      {isDataGreaterThanThreshold && (
        <TablePagination
          className="rustic-table-pagination"
          data-cy="table-pagination"
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Rows:"
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-selectLabel': {
              color: theme.palette.text.disabled,
            },
            ...(isMobile && {
              '& .MuiTablePagination-spacer': {
                position: 'absolute',
              },
              '& .MuiToolbar-root': {
                padding: 0,
              },
              '& .MuiTablePagination-displayedRows': {
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
              },
            }),
          }}
        />
      )}
    </Stack>
  )
}
