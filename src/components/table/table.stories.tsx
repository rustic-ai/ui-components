import type { Meta } from '@storybook/react'

import Table from './table'

const meta: Meta<React.ComponentProps<typeof Table>> = {
  title: 'Rustic UI/Table/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `Table` component provides a simple and customizable table display for presenting structured data. It supports rendering data rows with associated headers and allows for easy customization of table title, description, and column headers.',
      },
    },
  },
}

meta.argTypes = {
  ...meta.argTypes,
  headers: {
    table: {
      type: {
        summary: 'Array of TableHeader.',
        detail:
          'Each TableHeader has the following fields:\n' +
          '  dataKey: Field in table data for this header. \n' +
          '  label: Optional label for this header.\n',
      },
      defaultValue: {
        summary:
          'If no headers are provided, the keys from data are used to generate this.\n' +
          'In such cases, the header label defaults to the capitalized key.',
      },
    },
  },
}

export default meta

const sampleData = [
  {
    food: 'chocolate milk',
    calories: 219,
    carbs: 27.31,
    protein: 8.37,
    fat: 8.95,
  },
  {
    food: 'whole milk',
    calories: 165,
    carbs: 11.99,
    protein: 8.46,
    fat: 9.44,
  },
  {
    food: '2% skimmed milk',
    calories: 129,
    carbs: 12.38,
    protein: 8.51,
    fat: 5.1,
  },
  {
    food: '1% skimmed milk',
    calories: 108,
    carbs: 12.87,
    protein: 8.69,
    fat: 2.5,
  },
  {
    food: 'skim milk',
    calories: 88,
    carbs: 12.84,
    protein: 8.72,
    fat: 0.21,
  },
]

export const Default = {
  args: {
    data: sampleData,
  },
}

export const ChangeOrderUsingHeader = {
  args: {
    data: sampleData,
    headers: [
      { dataKey: 'food' },
      { dataKey: 'carbs' },
      { dataKey: 'protein' },
      { dataKey: 'fat' },
      { dataKey: 'calories' },
    ],
  },
}

export const HasTitleAndDescription = {
  args: {
    title: 'Nutrient Data Comparison Across Various Types of Milk',
    description:
      'This table illustrates the variations in calories and nutrients for different types of milk, with measurements based on a serving size of 250 ml. Caloric values are expressed in kCal, and nutrient quantities are measured in grams. The data is sourced from the Canadian Nutrient File.',
    data: sampleData,
  },
}

export const CustomizeHeaders = {
  args: {
    title: 'Nutrient Data Comparison Across Various Types of Milk',
    headers: [
      { dataKey: 'food', label: 'type (per 250ml)' },
      { dataKey: 'calories', label: 'calories (kCal)' },
      { dataKey: 'carbs', label: 'carbs (g)' },
      { dataKey: 'protein', label: 'protein (g)' },
      { dataKey: 'fat', label: 'fat (g)' },
    ],
    description:
      'This table illustrates the variations in calories and nutrients for different types of milk, with measurements based on a serving size of 250 ml. Caloric values are expressed in kCal, and nutrient quantities are measured in grams. The data is sourced from the Canadian Nutrient File.',
    data: sampleData,
  },
}

export const NoData = {
  args: {
    data: [],
  },
}
