import './rechartsTimeSeries.css'

import Crop32Icon from '@mui/icons-material/Crop169'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
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

import { defaultChartStrokeColors } from '../../rusticTheme'
import { defaultTimeSeriesProps } from '../defaultProps'
import { calculateTimeDiffInDays, formatTimestampLabel } from '../helper'
import type {
  TimeSeriesData,
  TimeSeriesDataset,
  TimeSeriesType,
} from '../types'
import TimeSeriesWrapper from './timeSeriesWrapper'
const TimeSeriesComponents = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
}

export interface RechartsTimeSeriesData extends TimeSeriesData {
  /** Callback function to be called when a data point on the graph is clicked. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (...args: any[]) => any
  /** Pass a function to format tooltip content. */
  tooltipFormatter?: (value: number, name: string) => [string, string]
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

function RechartsTimeSeries(props: RechartsTimeSeriesData) {
  const [timeSeriesType, setTimeSeriesType] = useState<TimeSeriesType>(
    props.defaultChartType || 'line'
  )
  const [timeSeries, setTimeSeries] = useState<TimeSeriesDataset[]>(
    props.timeSeries
  )

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

  function getDefaultStrokeColor(index: number) {
    const colorIndex = index % defaultChartStrokeColors.length
    return defaultChartStrokeColors[colorIndex]
  }

  function getStrokeColor(key: string, index: number) {
    if (props.chartColors && props.chartColors[key].stroke) {
      return props.chartColors[key].stroke
    } else {
      return getDefaultStrokeColor(index)
    }
  }

  function renderChartComponent(key: string, index: number) {
    const chartStrokeColor = datasetsVisibility[key]
      ? getStrokeColor(key, index)
      : 'transparent'

    function getFillColor(key: string) {
      if (datasetsVisibility[key]) {
        if (props.chartColors && props.chartColors[key].fill) {
          return props.chartColors[key].fill
        } else {
          return getDefaultStrokeColor(index)
        }
      }
    }

    const chartFillColor = datasetsVisibility[key]
      ? getFillColor(key)
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
            stroke={chartStrokeColor}
            activeDot={props.onClick && onClickFields}
          />
        )
      case 'bar':
        return (
          <Bar
            key={key}
            dataKey={key}
            //Recharts doesn't support stroke very well. By default, tooltip use the fill color for tooltip label.
            fill={chartStrokeColor}
            onClick={props.onClick && onClickFields.onClick}
            cursor={props.onClick && onClickFields.cursor}
          />
        )
      case 'area':
        return (
          <Fragment key={key}>
            <defs>
              <linearGradient id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartFillColor}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartFillColor}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              key={key}
              isAnimationActive={false}
              dataKey={key}
              type="monotone"
              stroke={chartStrokeColor}
              fillOpacity={1}
              fill={`url(#color${key})`}
              activeDot={props.onClick && onClickFields}
            />
          </Fragment>
        )
    }
  }

  function getLegendColor(dataKey: string, index: number): string {
    return datasetsVisibility[dataKey] ? getStrokeColor(dataKey, index) : 'grey'
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
          >
            <Crop32Icon
              sx={{
                color: getLegendColor(dataKey, index),
              }}
            />
            <Typography
              variant="body2"
              display="inline"
              sx={{
                color: getLegendColor(dataKey, index),
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

  let timeSeriesDuration: number
  if (props.timeSeries.length > 0) {
    const lastTimeSeriesItem = props.timeSeries[props.timeSeries.length - 1]
    const firstTimeSeriesItem = props.timeSeries[0]

    timeSeriesDuration = calculateTimeDiffInDays(
      firstTimeSeriesItem[xAxisField],
      lastTimeSeriesItem[xAxisField]
    )
  }

  return (
    <TimeSeriesWrapper
      timeSeriesType={timeSeriesType}
      setTimeSeriesType={setTimeSeriesType}
      timeSeries={props.timeSeries}
      disableChartTypeToggle={props.disableChartTypeToggle}
      title={props.title}
      description={props.description}
    >
      <ResponsiveContainer
        aspect={props.aspectRatio}
        width={props.width}
        maxHeight={props.maxHeight}
        minWidth={props.minChartWidth}
      >
        <TimeSeriesParentComponent
          data={timeSeries}
          margin={props.chartSpacing}
        >
          <XAxis
            dataKey={xAxisField}
            tickFormatter={(value) =>
              formatTimestampLabel(value, timeSeriesDuration)
            }
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={props.yAxisTickFormatter}
          />
          <Tooltip
            labelFormatter={(label: number) => [
              formatTimestampLabel(label, timeSeriesDuration),
            ]}
            formatter={props.tooltipFormatter}
          />
          <Legend content={renderLegend} />

          {yAxisFields.map((key, index) =>
            datasetsVisibility[key] ? renderChartComponent(key, index) : null
          )}
          {props.referenceLineYAxis &&
            props.referenceLineYAxis.map((referenceLine, index) => {
              return (
                <ReferenceLine
                  key={index}
                  y={referenceLine}
                  label={
                    props.referenceLineLabel && props.referenceLineLabel[index]
                  }
                  stroke={
                    props.referenceLineColor && props.referenceLineColor[index]
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
    </TimeSeriesWrapper>
  )
}

RechartsTimeSeries.defaultProps = {
  ...defaultTimeSeriesProps,
}

export default RechartsTimeSeries
