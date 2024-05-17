import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import VegaLiteChart from './vegaLiteChart'
const meta: Meta<React.ComponentProps<typeof VegaLiteChart>> = {
  title: 'Rustic UI/Chart/Vega-Lite Chart',
  component: VegaLiteChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
meta.argTypes = {
  ...meta.argTypes,
  theme: {
    table: {
      type: {
        summary: 'Theme object.\n',
        detail:
          'A theme object has the following fields:\n' +
          '  light: A light theme string that is supported by vega-themes.\n' +
          '  dark: A dark theme string that is supported by vega-themes.\n' +
          'Refer to the [vega-themes](https://github.com/vega/vega-themes) documentation for more information.',
      },
    },
  },
  options: {
    description:
      'The options object is passed directly to the vega-lite chart. Refer to the [Vega-lite documentation](https://vega.github.io/vega-lite/) for more information.',
  },
}
const decorators = [
  (Story: StoryFn) => {
    return (
      <div
        style={{
          width: 'clamp(250px, 70vw, 1000px)',
          height: 'clamp(150px, 30vh, 400px)',
        }}
      >
        <Story />
      </div>
    )
  },
]

export const BarChart = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 'container',
      title: 'Bar Chart Title',
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
          { a: 'C', b: 43 },
          { a: 'D', b: 91 },
          { a: 'E', b: 81 },
          { a: 'F', b: 53 },
          { a: 'G', b: 19 },
          { a: 'H', b: 87 },
          { a: 'I', b: 52 },
        ],
      },
      mark: 'bar',
      encoding: {
        x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
        y: { field: 'b', type: 'quantitative' },
      },
    },
  },
  decorators,
}

export const PieChart = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 'container',
      padding: 8,
      data: {
        values: [
          { category: 1, value: 4 },
          { category: 2, value: 6 },
          { category: 3, value: 10 },
          { category: 4, value: 3 },
          { category: 5, value: 7 },
          { category: 6, value: 8 },
        ],
      },
      mark: {
        type: 'arc',
        tooltip: true,
      },
      encoding: {
        theta: { field: 'value', type: 'quantitative', stack: 'normalize' },
        color: { field: 'category', type: 'nominal' },
      },
    },
  },
  decorators,
}

export const WithTitleAndDescription = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 'container',
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
          { a: 'C', b: 43 },
          { a: 'D', b: 91 },
          { a: 'E', b: 81 },
          { a: 'F', b: 53 },
          { a: 'G', b: 19 },
          { a: 'H', b: 87 },
          { a: 'I', b: 52 },
        ],
      },
      mark: 'bar',
      encoding: {
        x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
        y: { field: 'b', type: 'quantitative' },
      },
    },
    title: 'Bar Chart Title',
    description: 'This chart shows the bar chart with title and description',
  },
  decorators,
}

export const InvalidChart = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
        ],
      },
      encoding: {
        x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
        y: { field: 'b', type: 'quantitative' },
      },
    },
  },
}
