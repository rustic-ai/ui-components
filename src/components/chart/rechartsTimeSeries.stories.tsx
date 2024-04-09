/* eslint-disable no-magic-numbers */
import type { Meta } from '@storybook/react'

import RechartsTimeSeries from './rechartsTimeSeries'

const meta: Meta<React.ComponentProps<typeof RechartsTimeSeries>> = {
  title: 'Rustic UI/Chart/Recharts Time Series',
  component: RechartsTimeSeries,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `RechartsTimeSeries` component integrates the [Recharts](https://recharts.org/en-US/api) library to facilitate the visualization of time-based data through various chart types such as line charts, bar charts, and area charts. It supports customizations for reference lines, tooltips, and chart type toggling, providing a flexible and interactive data representation solution.',
      },
    },
  },
}

meta.argTypes = {
  ...meta.argTypes,
  timeSeries: {
    table: {
      type: {
        summary: 'Array of TimeSeriesDataset.\n',
        detail:
          'Each TimeSeriesDataset has the following fields:\n' +
          '  timestamp: timestamp in milliseconds  \n' +
          '  [key: string]: data for other data fields',
      },
    },
  },
  chartColors: {
    table: {
      type: {
        summary: 'ChartColors object.\n',
        detail:
          "ChartColors can have multiple fields and each field should be the name of a dataKey, e.g. 'uv'\n" +
          'Each field could have the following properties\n' +
          '  stroke: Optional stroke color for a specific dataKey \n' +
          '  fill: Optional fill color for a specific dataKey',
      },
    },
  },
  chartSpacing: {
    table: {
      type: {
        summary: 'ChartSpacing object.\n',
        detail:
          'ChartSpacing has the following fields:\n' +
          '  top: the number value of top padding/margin in pixels \n' +
          '  right: the number value of right padding/margin in pixels  \n' +
          '  bottom: the number value of bottom padding/margin in pixels  \n' +
          '  left: the number value of left padding/margin in pixels',
      },
    },
  },
  updatedData: {
    table: {
      type: {
        summary: 'An array of TimeSeriesFormat.\n',
        detail:
          'All of the fields listed above could be used.\n' +
          'Normally only timeSeries is used to update the chart.',
      },
    },
  },
}

export default meta

const oneDayData = [
  {
    timestamp: 1706400030000,
    AMZN: 154.84,
    APPL: 189,
  },
  {
    timestamp: 1706400090000,
    AMZN: 156.06,
    APPL: 182,
  },
  {
    timestamp: 1706400150000,
    AMZN: 155.64,
    APPL: 184.32,
  },
  {
    timestamp: 1706400210000,
    AMZN: 154.49,
    APPL: 185.78,
  },
  {
    timestamp: 1706400270000,
    AMZN: 155.41,
    APPL: 186.06,
  },
]

const manyDaysData = [
  {
    timestamp: 1704096000000,
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    timestamp: 1704182400000,
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    timestamp: 1704268800000,
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    timestamp: 1704355200000,
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    timestamp: 1704441600000,
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
]

const longData = [
  {
    timestamp: 1706400030000,
    AMZN: 154000000,
    APPL: 189000000,
  },
  {
    timestamp: 1706400090000,
    AMZN: 156060000,
    APPL: 187000000,
  },
  {
    timestamp: 1706400150000,
    AMZN: 155640000,
    APPL: 184320000,
  },
]

export const Default = {
  args: {
    title: 'Demo Time Series Chart',
    timeSeries: manyDaysData,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
}

export const WithReferenceLine = {
  args: {
    ...Default.args,
    referenceLineYAxis: [4500],
  },
}

export const ReferenceLineAboveMaxValue = {
  args: {
    ...Default.args,
    referenceLineYAxis: [12000],
    referenceLineLabel: ['Above Max Value'],
    referenceLineColor: ['blue'],
  },
}

export const ReferenceLineBelowMinValue = {
  args: {
    ...Default.args,
    referenceLineYAxis: [500],
    referenceLineLabel: ['Below Min Value'],
    referenceLineColor: ['green'],
  },
}

export const MultipleReferenceLines = {
  args: {
    ...Default.args,
    referenceLineYAxis: [500, 5000, 12000],
    referenceLineLabel: ['Below', 'Between', 'Above'],
    referenceLineColor: ['blue', 'red', 'green'],
    referenceLineStrokeWidth: [2, 1, 3],
  },
}

export const NoTitleAndDescription = {
  args: {
    timeSeries: oneDayData,
  },
}

export const CustomizedWidthAndAspect = {
  args: {
    timeSeries: oneDayData,
    width: 400,
    aspectRatio: 1,
  },
}

export const NoTimeSeriesData = {
  args: {
    title: 'Demo Time Series Chart',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    timeSeries: [],
  },
}

export const BarChartWithoutChartTypeToggle = {
  args: {
    title: 'Demo Time Series Chart',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    timeSeries: oneDayData,
    disableChartTypeToggle: true,
    defaultChartType: 'bar',
  },
}

export const FormatData = {
  args: {
    title: 'Demo Time Series Chart',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    timeSeries: longData,
    yAxisTickFormatter: (value: number) => `${value / 1000000}M`,
    tooltipFormatter: (value: number, name: string) => [
      `${value / 1000000}M`,
      name,
    ],
    chartSpacing: { top: 20, left: 25, right: 25, bottom: 20 },
  },
}

export const CustomizeColors = {
  args: {
    ...Default.args,
    chartColors: {
      uv: { fill: '#A6EFA7', stroke: '#6BAB6C' },
      pv: { fill: '#F2FB8B', stroke: '#FFB000' },
      amt: { fill: '#C5B9F9', stroke: '#4C3B9A' },
    },
  },
}
