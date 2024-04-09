import MoreVertIcon from '@mui/icons-material/MoreVert'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React, { type Dispatch, type ReactNode, useState } from 'react'

import type { TimeSeriesDataset, TimeSeriesType } from '../types'

export type TimeSeriesWrapper = {
  children: ReactNode
  disableChartTypeToggle?: boolean
  timeSeriesType: TimeSeriesType
  setTimeSeriesType: Dispatch<React.SetStateAction<TimeSeriesType>>
  timeSeries: TimeSeriesDataset[]
  title?: string
  description?: string
}

export default function TimeSeriesWrapper(props: TimeSeriesWrapper) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const timeSeriesTypes = ['line', 'bar', 'area']

  function handleChartTypeToggle(event?: React.MouseEvent<HTMLElement>) {
    anchorEl ? setAnchorEl(null) : event && setAnchorEl(event.currentTarget)
  }

  function handleChartTypeClick(chartType: TimeSeriesType) {
    props.setTimeSeriesType(chartType)
    handleChartTypeToggle()
  }

  if (props.timeSeries.length === 0) {
    return <Typography variant="body2">No data available</Typography>
  }

  return (
    <Box className="rustic-recharts-time-series">
      {/* will be replaced by a dropdown menu in a follow up */}
      {!props.disableChartTypeToggle && (
        <FormControl className="rustic-recharts-time-series-chart-toggle">
          <IconButton
            aria-label="chart options"
            aria-expanded={Boolean(anchorEl)}
            aria-haspopup="true"
            onClick={handleChartTypeToggle}
          >
            <MoreVertIcon sx={{ color: 'primary.main' }} />
          </IconButton>
          <Menu
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={(e: React.MouseEvent<HTMLElement>) =>
              handleChartTypeToggle(e)
            }
          >
            <Typography className="rustic-recharts-time-series-chart-toggle-title">
              Chart Types:
            </Typography>
            {timeSeriesTypes.map((chartType) => {
              return (
                <MenuItem
                  value={chartType}
                  key={chartType}
                  selected={chartType === props.timeSeriesType}
                  onClick={() => {
                    return handleChartTypeClick(chartType as TimeSeriesType)
                  }}
                >
                  {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
                </MenuItem>
              )
            })}
          </Menu>
        </FormControl>
      )}
      <Box data-cy={`${props.timeSeriesType}-chart`}>
        {props.title && (
          <Typography
            variant="subtitle2"
            className="rustic-recharts-time-series-title"
            data-cy="time-series-title"
          >
            {props.title}
          </Typography>
        )}

        {props.description && (
          <Typography
            variant="caption"
            className="rustic-recharts-time-series-description"
          >
            {props.description}
          </Typography>
        )}
        {props.children}
      </Box>
    </Box>
  )
}
