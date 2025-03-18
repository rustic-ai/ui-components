import './rechartsTimeSeries.css'

import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import useTheme from '@mui/system/useTheme'
import { Fragment, useEffect, useState } from 'react'
import React from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { calculateTimeDiffInDays, formatTimestampLabel } from '../../helper'
import Icon from '../../icon/icon'
import MarkedMarkdown from '../../markdown/markedMarkdown'

export interface TimeSeriesData {
  timestamp: number
  [key: string]: number
}

export interface Margin {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export interface RechartsTimeSeriesProps {
  /** Data to be displayed in the time series chart. The first field is used as the x-axis field. We currently support formatting timestamps in milliseconds. Other data types will be displayed as given. */
  timeSeries: TimeSeriesData[]
  /** An array containing a predefined set of Hex color codes or string colors (e.g. 'blue'). The colors will be applied to the keys of the data object in order. */
  chartColors: string[]
  /** Array of y-axis reference lines. */
  referenceLineYAxis?: number[]
  /** Array of y-axis reference line colors. Hex color codes and string colors are both supported for defining colors. If not provided, all lines default to grey. Skip providing a custom color for a certain y-axis by providing an empty string. */
  referenceLineColor?: string[]
  /** Array of y-axis reference line labels. Skip providing a custom label for a certain y-axis by providing an empty string. */
  referenceLineLabel?: string[]
  /** Array of y-axis reference line stroke widths. If not provided, all lines default to 1. Skip providing a custom stroke width for a certain y-axis by providing an empty string. */
  referenceLineStrokeWidth?: number[]
  /** Title of the time series chart. */
  title?: string
  /** Description of the time series chart. */
  description?: string
  // TODO: define onClick type - task <5991977827>
  /** Callback function to be called when a point on the graph is clicked. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (...args: any[]) => any
  /** Width of the y-axis labels in pixels. */
  yAxisLabelWidth?: number
  /** Minimum width of the chart in pixels. */
  minChartWidth?: number
  /** Maximum width of the chart in pixels. */
  maxHeight?: number
  /** Updated data will be added to the original time series data. */
  updatedData?: { timeSeries: TimeSeriesData[] }[]
  /** Aspect ratio of the chart. */
  aspectRatio?: number
  /** Width of the chart in pixels. */
  width?: number
  /** Chart type toggle will be hidden if the value is true. */
  disableChartTypeToggle?: boolean
  /** Define the default chart type: `line`, `bar`, or `area`. */
  defaultChartType?: TimeSeriesType
  /** Pass a function to format y-axis label. Make sure to use tooltipFormatter and yAxisTickFormatter together so that the numbers are uniform. */
  yAxisTickFormatter?: (value: number) => string
  /** Pass a function to format tooltip content. */
  tooltipFormatter?: (value: number, name: string) => [string, string]
  /** Margin of chart container in pixels. For example, adding left margin could show larger numbered labels properly. */
  chartContainerMargin?: Margin
}

export type TimeSeriesType = 'line' | 'bar' | 'area'

const TimeSeriesComponents = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
}

//All of lines should be shown initially
function showAllDatasets(yAxisFields: string[]) {
  const initialVisibility: { [key: string]: boolean } = {}

  yAxisFields.forEach((yAxisField) => {
    initialVisibility[yAxisField] = true
  })

  return initialVisibility
}

function areAllDatasetsVisible(datasetsVisibility: { [key: string]: boolean }) {
  return Object.values(datasetsVisibility).every((value) => value === true)
}
const defaultMinChartWidth = 200
const defaultMaxHeight = 600
const defaultYAxisLabelWidth = 30
/** > **Deprecated:** Use other visualization components instead. This component will be removed in the next release.
 *
 * The `RechartsTimeSeries` component integrates the [Recharts](https://recharts.org/en-US/api) library to facilitate the visualization of time-based data through various chart types such as line charts, bar charts, and area charts. It supports customizations for reference lines, tooltips, and chart type toggling, providing a flexible and interactive data representation solution.
 *
 * Note: `Recharts` is not bundled, so please install the following package using npm:
 *
 * ```
 * npm i recharts
 * ```
 */
function RechartsTimeSeries({
  minChartWidth = defaultMinChartWidth,
  maxHeight = defaultMaxHeight,
  yAxisLabelWidth = defaultYAxisLabelWidth,
  // eslint-disable-next-line no-magic-numbers
  aspectRatio = 16 / 9,
  disableChartTypeToggle = false,
  ...props
}: RechartsTimeSeriesProps) {
  const [timeSeriesType, setTimeSeriesType] = useState<TimeSeriesType>(
    props.defaultChartType || 'line'
  )
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [timeSeries, setTimeSeries] = useState<object[]>(props.timeSeries)
  const theme = useTheme()
  const dataFields = timeSeries.length > 0 ? Object.keys(timeSeries[0]) : []
  const xAxisField = dataFields[0]
  const yAxisFields = dataFields.slice(1)

  const [datasetsVisibility, setDatasetsVisibility] = useState<{
    [key: string]: boolean
  }>(showAllDatasets(yAxisFields))

  useEffect(() => {
    if (props.updatedData && props.updatedData.length > 0) {
      let newData = [...props.timeSeries]
      props.updatedData.forEach((data) => {
        newData = newData.concat(data.timeSeries)
        setTimeSeries(newData)
      })
    }
  }, [props.timeSeries, props.updatedData])

  const TimeSeriesParentComponent = TimeSeriesComponents[timeSeriesType]

  function handleChartTypeToggle(event?: React.MouseEvent<HTMLElement>) {
    if (anchorEl) {
      setAnchorEl(null)
    } else if (event) {
      setAnchorEl(event.currentTarget)
    }
  }

  function handleChartTypeClick(chartType: TimeSeriesType) {
    setTimeSeriesType(chartType)
    handleChartTypeToggle()
  }

  function handleLegendClick(clickedDataKey: string) {
    const isTheOnlyVisibleDataset =
      datasetsVisibility[clickedDataKey] &&
      !yAxisFields.find(
        (key) => key !== clickedDataKey && datasetsVisibility[key]
      )

    // If all lines are initially visible, only show the selected line and hide other lines
    if (areAllDatasetsVisible(datasetsVisibility)) {
      const newDatasetsVisibility: { [key: string]: boolean } = {}
      for (const key of yAxisFields) {
        const isSelected = key === clickedDataKey
        newDatasetsVisibility[key] = isSelected
      }
      setDatasetsVisibility(newDatasetsVisibility)
    } else {
      // If the clicked line is the only visible line, reset visibility to initial state
      if (isTheOnlyVisibleDataset) {
        setDatasetsVisibility(showAllDatasets(yAxisFields))
      } else {
        // Otherwise, toggle the visibility of the clicked line
        setDatasetsVisibility({
          ...datasetsVisibility,
          [clickedDataKey]: !datasetsVisibility[clickedDataKey],
        })
      }
    }
  }

  function renderChartComponent(key: string, index: number) {
    const colorIndex = index % props.chartColors.length
    const chartColor = datasetsVisibility[key]
      ? props.chartColors[colorIndex]
      : 'transparent'

    const onClickFields = {
      onClick: props.onClick,
      cursor: 'pointer',
    }

    switch (timeSeriesType) {
      case 'line':
        return (
          <Line
            type="monotone"
            // TODO make animation configurable - task <5870438845>
            isAnimationActive={false}
            dataKey={key}
            name={key}
            key={key}
            dot={false}
            stroke={chartColor}
            activeDot={props.onClick && onClickFields}
          />
        )
      case 'bar':
        return (
          <Bar
            key={key}
            dataKey={key}
            fill={chartColor}
            onClick={props.onClick && onClickFields.onClick}
            cursor={props.onClick && onClickFields.cursor}
          />
        )
      case 'area':
        return (
          <Fragment key={key}>
            <defs>
              <linearGradient id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              key={key}
              isAnimationActive={false}
              dataKey={key}
              type="monotone"
              stroke={chartColor}
              fillOpacity={1}
              fill={`url(#color${key})`}
              activeDot={props.onClick && onClickFields}
            />
          </Fragment>
        )
    }
  }

  function getLegendColor(dataKey: string, index: number): string {
    return datasetsVisibility[dataKey]
      ? props.chartColors[index % props.chartColors.length]
      : 'grey'
  }

  function getLegendTextDecorationStyle(dataKey: string): string {
    return datasetsVisibility[dataKey] ? 'none' : 'line-through'
  }

  function renderLegend() {
    return (
      <Box className="rustic-recharts-time-series-legend">
        {yAxisFields.map((dataKey, index) => (
          <Box
            key={index}
            className="rustic-recharts-time-series-legend-item"
            onClick={() => handleLegendClick(dataKey)}
            data-cy="legend-item"
            sx={{
              color: getLegendColor(dataKey, index),
            }}
          >
            <Icon name="crop_16_9" />
            <Typography
              variant="body2"
              display="inline"
              sx={{
                textDecorationLine: getLegendTextDecorationStyle(dataKey),
              }}
            >
              {dataKey}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

  if (timeSeries.length === 0) {
    return <Typography variant="body2">No data available</Typography>
  } else {
    const lastTimeSeriesItem = props.timeSeries[props.timeSeries.length - 1]
    const firstTimeSeriesItem = props.timeSeries[0]

    const timeSeriesDuration = calculateTimeDiffInDays(
      firstTimeSeriesItem[xAxisField],
      lastTimeSeriesItem[xAxisField]
    )

    return (
      <Box
        className="rustic-recharts-time-series"
        data-cy={`${timeSeriesType}-chart`}
      >
        {!disableChartTypeToggle && (
          <FormControl className="rustic-recharts-time-series-chart-toggle">
            <IconButton
              aria-label="chart options"
              aria-expanded={Boolean(anchorEl)}
              aria-haspopup="true"
              onClick={handleChartTypeToggle}
              color="primary"
            >
              <Icon name="more_vert" />
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
              {Object.keys(TimeSeriesComponents).map((chartType) => {
                return (
                  <MenuItem
                    value={chartType}
                    key={chartType}
                    selected={chartType === timeSeriesType}
                    onClick={() =>
                      handleChartTypeClick(chartType as TimeSeriesType)
                    }
                  >
                    {chartType.charAt(0).toUpperCase() + chartType.slice(1)}{' '}
                    Chart
                  </MenuItem>
                )
              })}
            </Menu>
          </FormControl>
        )}
        <Box>
          {props.title && (
            <Typography
              variant="h6"
              className="rustic-recharts-time-series-title"
              data-cy="time-series-title"
            >
              {props.title}
            </Typography>
          )}

          {props.description && <MarkedMarkdown text={props.description} />}

          <ResponsiveContainer
            aspect={aspectRatio}
            width={props.width}
            maxHeight={maxHeight}
            minWidth={minChartWidth}
          >
            <TimeSeriesParentComponent
              data={timeSeries}
              margin={props.chartContainerMargin}
            >
              <XAxis
                dataKey={xAxisField}
                tickFormatter={(value) =>
                  formatTimestampLabel(value, timeSeriesDuration)
                }
                stroke={theme.palette.text.primary}
              />
              <YAxis
                domain={['auto', 'auto']}
                width={yAxisLabelWidth}
                tickFormatter={props.yAxisTickFormatter}
                stroke={theme.palette.text.primary}
              />
              <Tooltip
                labelFormatter={(label: number) => [
                  formatTimestampLabel(label, timeSeriesDuration),
                ]}
                formatter={props.tooltipFormatter}
                contentStyle={{
                  color: theme.palette.common.black,
                }}
              />
              <Legend content={renderLegend} />

              {yAxisFields.map((key, index) =>
                datasetsVisibility[key]
                  ? renderChartComponent(key, index)
                  : null
              )}
              {props.referenceLineYAxis &&
                props.referenceLineYAxis.map((referenceLine, index) => {
                  return (
                    <ReferenceLine
                      key={index}
                      y={referenceLine}
                      label={
                        props.referenceLineLabel &&
                        props.referenceLineLabel[index]
                      }
                      stroke={
                        props.referenceLineColor &&
                        props.referenceLineColor[index]
                      }
                      strokeDasharray="3 3"
                      ifOverflow="extendDomain"
                      strokeWidth={
                        props.referenceLineStrokeWidth &&
                        props.referenceLineStrokeWidth[index]
                      }
                      isFront
                    />
                  )
                })}
            </TimeSeriesParentComponent>
          </ResponsiveContainer>
        </Box>
      </Box>
    )
  }
}

export default RechartsTimeSeries
