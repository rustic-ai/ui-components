import './table.css'

import { useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { default as MuiTable } from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

import { capitalizeFirstLetter } from '../helper'
import Icon from '../icon/icon'
import type { DataRow, TableData, TableHeader } from '../types'

const paginationThreshold = 10

type Order = 'asc' | 'desc'

type SortingCriteria = { [dataKey: string]: Order }

export default function Table(props: TableData) {
  if (props.data.length === 0) {
    return <Typography variant="body2">No data available</Typography>
  }

  const isPaginationEnabled = props.data.length > paginationThreshold
  const [sortingCriteria, setSortingCriteria] = useState<SortingCriteria>({})
  const [rowsPerPage, setRowsPerPage] = useState(
    isPaginationEnabled ? paginationThreshold : -1
  )
  const [currentPage, setCurrentPage] = useState(0)
  const theme = useTheme()

  const dataKeys = Array.from(
    new Set(props.data.flatMap((rowData) => Object.keys(rowData)))
  )
  const headers: TableHeader[] =
    props.headers || dataKeys.map((key) => ({ dataKey: key }))

  function handleSortRequest(dataKey: string) {
    setSortingCriteria((prevCriteria) => {
      const currentOrder = prevCriteria[dataKey]

      if (currentOrder === 'asc') {
        return { [dataKey]: 'desc' }
      } else if (currentOrder === 'desc') {
        return {}
      } else {
        return { [dataKey]: 'asc' }
      }
    })
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value)
    setCurrentPage(0)
  }

  function sortComparator(a: DataRow, b: DataRow) {
    const sortingKey = Object.keys(sortingCriteria)[0]
    const sortingOrder = sortingCriteria[sortingKey]

    if (a[sortingKey] < b[sortingKey]) {
      return sortingOrder === 'desc' ? 1 : -1
    }
    if (a[sortingKey] > b[sortingKey]) {
      return sortingOrder === 'desc' ? -1 : 1
    }
    return 0
  }

  function sortData(array: DataRow[]) {
    // Pair each element with its original index to stabilize the sort
    const stabalizedArray: [DataRow, number][] = array.map((element, index) => [
      element,
      index,
    ])

    stabalizedArray.sort(([a, aIndex], [b, bIndex]) => {
      const comparisonResult = sortComparator(a, b)
      if (comparisonResult !== 0) {
        return comparisonResult
      } else {
        // Use original index to maintain stable sort order
        return aIndex - bIndex
      }
    })

    // Extract and return the sorted data without the indices
    return stabalizedArray.map(([element]) => element)
  }

  const sortedData = sortData(props.data)

  const dataOfCurrentPage = sortedData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  )

  const dataToDisplay = rowsPerPage > 0 ? dataOfCurrentPage : sortedData

  function getHeaderIcon(dataKey: string) {
    if (sortingCriteria[dataKey]) {
      return (
        <TableSortLabel
          active={true}
          direction={sortingCriteria[dataKey] || 'asc'}
          className="rustic-table-header-icon"
        />
      )
    } else {
      return (
        <Tooltip title="Notifications">
          <Icon name="expand_all" className="rustic-table-header-icon" />
        </Tooltip>
      )
    }
  }

  function getTooltipTitle(dataKey: string): string {
    const sortDirection = sortingCriteria[dataKey]
    if (sortDirection) {
      const capitalizedSortDirection =
        sortDirection.charAt(0).toUpperCase() + sortDirection.slice(1)
      return capitalizedSortDirection + 'ending'
    } else {
      return 'Sort'
    }
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
                  <TableCell
                    key={`header-${index}`}
                    //for adding aria label
                    sortDirection={sortingCriteria[header.dataKey] || 'unset'}
                    onClick={() => handleSortRequest(header.dataKey)}
                  >
                    <Tooltip title={getTooltipTitle(header.dataKey)}>
                      <Button
                        endIcon={getHeaderIcon(header.dataKey)}
                        className="rustic-table-header-button"
                      >
                        {header.label || capitalizeFirstLetter(header.dataKey)}
                      </Button>
                    </Tooltip>
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
            toolbar: 'rustic-table-toolbar',
            input: 'rustic-table-input',
            spacer: 'rustic-table-spacer',
            displayedRows: 'rustic-table-displayed-rows',
            actions: 'rustic-table-actions',
          }}
        />
      )}
    </Stack>
  )
}
