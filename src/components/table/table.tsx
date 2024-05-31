import './table.css'

import { useTheme } from '@mui/material'
import Stack from '@mui/material/Stack'
import { default as MuiTable } from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

import { capitalizeFirstLetter } from '../helper'
import type { DataRow, TableData, TableHeader } from '../types'

const paginationThreshold = 10

type Order = 'asc' | 'desc'

export default function Table(props: TableData) {
  if (props.data.length === 0) {
    return <Typography variant="body2">No data available</Typography>
  }

  const isPaginationEnabled = props.data.length > paginationThreshold

  const theme = useTheme()

  const dataKeys = Array.from(
    new Set(props.data.flatMap((rowData) => Object.keys(rowData)))
  )
  const headers: TableHeader[] =
    props.headers || dataKeys.map((key) => ({ dataKey: key }))

  const [orderBy, setOrderBy] = useState<string>(dataKeys[0])
  const [order, setOrder] = useState<Order>('asc')
  const [rowsPerPage, setRowsPerPage] = useState(
    isPaginationEnabled ? paginationThreshold : -1
  )
  const [currentPage, setCurrentPage] = useState(0)

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value)
    setCurrentPage(0)
  }

  function handleRequestSort(dataKey: string) {
    const newOrder = order === 'asc' ? 'desc' : 'asc'

    setOrderBy(dataKey)
    setOrder(newOrder)
  }

  function descendingComparator(a: DataRow, b: DataRow, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

  function getComparator(order: Order, orderBy: string) {
    return order === 'desc'
      ? (a: DataRow, b: DataRow) => descendingComparator(a, b, orderBy)
      : (a: DataRow, b: DataRow) => -descendingComparator(a, b, orderBy)
  }

  function sortData(
    array: DataRow[],
    comparator: (a: DataRow, b: DataRow) => number
  ) {
    const stabilizedArray: [DataRow, number][] = array.map((el, index) => [
      el,
      index,
    ])
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) {
        return order
      } else {
        return a[1] - b[1]
      }
    })
    return stabilizedArray.map((el) => el[0])
  }

  const sortedData = sortData(props.data, getComparator(order, orderBy))

  const dataOfCurrentPage = sortedData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  )

  const dataToDisplay = rowsPerPage > 0 ? dataOfCurrentPage : sortedData

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
                  <TableCell
                    key={`header-${index}`}
                    sortDirection={orderBy === header.dataKey ? order : 'asc'}
                  >
                    <TableSortLabel
                      active={orderBy === header.dataKey}
                      direction={orderBy === header.dataKey ? order : 'asc'}
                      onClick={() => handleRequestSort(header.dataKey)}
                    >
                      {header.label || capitalizeFirstLetter(header.dataKey)}
                    </TableSortLabel>
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
      {isPaginationEnabled && (
        <TablePagination
          className="rustic-table-pagination"
          data-cy="table-pagination"
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Rows:"
          page={currentPage}
          onPageChange={(
            event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
            newPage: number
          ) => setCurrentPage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-selectLabel': {
              color: theme.palette.text.disabled,
            },
          }}
          classes={{
            toolbar: 'rustic-toolbar',
            input: 'rustic-input',
            spacer: 'rustic-spacer',
            displayedRows: 'rustic-displayed-rows',
            actions: 'rustic-actions',
          }}
        />
      )}
    </Stack>
  )
}
