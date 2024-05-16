import type { StoryFn } from '@storybook/react'
import React from 'react'

import VegaLiteChart from './vegaLiteChart'

export default {
  title: 'Rustic UI/Chart/Vega-Lite Chart',
  component: VegaLiteChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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

export const Scatterplot = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 'container',
      title: 'Horsepower and miles per gallons for various cars.',
      data: { url: 'chartData/plot.json' },
      mark: 'point',
      encoding: {
        x: { field: 'Horsepower', type: 'quantitative' },
        y: { field: 'Miles_per_Gallon', type: 'quantitative' },
      },
    },
  },
  decorators,
}

export const ErrorBars = {
  args: {
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 'container',
      data: { url: 'chartData/errorBar.json' },
      encoding: { y: { field: 'variety', type: 'ordinal' } },
      autosize: {
        type: 'fit',
        contains: 'padding',
        resize: true,
      },
      layer: [
        {
          mark: { type: 'point', filled: true },
          encoding: {
            x: {
              aggregate: 'mean',
              field: 'yield',
              type: 'quantitative',
              scale: { zero: false },
              title: 'Barley Yield',
            },
            color: { value: 'black' },
          },
        },
        {
          mark: { type: 'errorbar', extent: 'ci' },
          encoding: {
            x: { field: 'yield', type: 'quantitative', title: 'Barley Yield' },
          },
        },
      ],
    },
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
