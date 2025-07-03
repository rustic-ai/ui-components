import type { Meta } from '@storybook/react-webpack5'

import Table from './table'

const meta: Meta<React.ComponentProps<typeof Table>> = {
  title: 'Rustic UI/Table/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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

const textData = {
  title: 'Nutrient Data Comparison Across Various Types of Milk',
  description:
    'This table illustrates the variations in calories and nutrients for different types of milk, with measurements based on a serving size of 250 ml. Caloric values are expressed in kCal, and nutrient quantities are measured in grams. The data is sourced from the Canadian Nutrient File.',
}

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

const manyDataRows = [
  ...sampleData,
  {
    food: 'almond milk',
    calories: 30,
    carbs: 1.0,
    protein: 1.0,
    fat: 2.5,
  },
  {
    food: 'soy milk',
    calories: 80,
    carbs: 4.0,
    protein: 7.0,
    fat: 4.0,
  },
  {
    food: 'rice milk',
    calories: 120,
    carbs: 22.0,
    protein: 1.0,
    fat: 2.5,
  },
  {
    food: 'coconut milk',
    calories: 45,
    carbs: 2.0,
    protein: 0.5,
    fat: 4.5,
  },
  {
    food: 'oat milk',
    calories: 120,
    carbs: 16.0,
    protein: 3.0,
    fat: 5.0,
  },
  {
    food: 'hemp milk',
    calories: 70,
    carbs: 1.0,
    protein: 3.0,
    fat: 6.0,
  },
  {
    food: 'cashew milk',
    calories: 25,
    carbs: 1.0,
    protein: 1.0,
    fat: 2.0,
  },
  {
    food: 'pea milk',
    calories: 70,
    carbs: 0.0,
    protein: 8.0,
    fat: 4.5,
  },
  {
    food: 'goat milk',
    calories: 168,
    carbs: 11.0,
    protein: 9.0,
    fat: 10.0,
  },
  {
    food: 'camel milk',
    calories: 107,
    carbs: 5.8,
    protein: 5.2,
    fat: 4.5,
  },
  {
    food: 'buffalo milk',
    calories: 237,
    carbs: 12.0,
    protein: 9.0,
    fat: 16.0,
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
    ...textData,
    data: sampleData,
  },
}

export const CustomizeHeaders = {
  args: {
    ...textData,
    headers: [
      { dataKey: 'food', label: 'type (per 250ml)' },
      { dataKey: 'calories', label: 'calories (kCal)' },
      { dataKey: 'carbs', label: 'carbs (g)' },
      { dataKey: 'protein', label: 'protein (g)' },
      { dataKey: 'fat', label: 'fat (g)' },
    ],
    data: sampleData,
  },
}

export const MoreThanTenRows = {
  args: {
    ...textData,
    data: manyDataRows,
  },
}

export const NoData = {
  args: {
    data: [],
  },
}
