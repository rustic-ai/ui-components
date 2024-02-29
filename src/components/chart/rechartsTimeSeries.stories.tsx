/* eslint-disable no-magic-numbers */
import RechartsTimeSeries from './rechartsTimeSeries'

export default {
  title: 'Rustic UI/Chart/Recharts Time Series',
  component: RechartsTimeSeries,
  tags: ['autodocs'],
  argTypes: {
    timeSeries: {
      control: 'array',
      description:
        'Data to be displayed in the time series chart. The first field is used as the x-axis field. We currently support formatting timestamps in seconds and milliseconds. Other data types will be displayed as given. \n<pre>```interface TimeSeriesData:{\n  timestamp: number\n  [key: string]: number\n}```</pre>',
    },
  },
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

const chartColors = ['#648FFF', '#785EF0', '#DC267F', '#FE6100', '#FFB000']

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
    yAxisLabelWidth: 60,
    chartColors,
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
    chartColors,
  },
}

export const CustomizedWidthAndAspect = {
  args: {
    timeSeries: oneDayData,
    width: 400,
    aspectRatio: 1,
    chartColors,
  },
}

export const NoTimeSeriesData = {
  args: {
    title: 'Demo Time Series Chart',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    timeSeries: [],
    chartColors,
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
    chartColors,
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
    chartContainerMargin: { top: 20, left: 25, right: 25, bottom: 20 },
    chartColors,
  },
}
