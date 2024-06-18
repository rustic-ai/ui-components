/* eslint-disable no-magic-numbers */
import type { StoryFn } from '@storybook/react'
import React from 'react'

import PerspectiveTable from './perspectiveTable'

export default {
  title: 'Rustic UI/Perspective Table/Perspective Table',
  component: PerspectiveTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

const regions: ('East' | 'West' | 'South' | 'Midwest')[] = [
  'East',
  'West',
  'South',
  'Midwest',
]
const regionsAndStates: Record<
  'East' | 'West' | 'South' | 'Midwest',
  string[]
> = {
  East: ['New York', 'Pennsylvania'],
  West: ['California', 'Washington'],
  South: ['Texas', 'Florida'],
  Midwest: ['Illinois'],
}
const categories: (
  | 'Technology'
  | 'Furniture'
  | 'Office Supplies'
  | 'Apparel'
  | 'Food and Beverage'
)[] = [
  'Technology',
  'Furniture',
  'Office Supplies',
  'Apparel',
  'Food and Beverage',
]
const subCategories: Record<
  | 'Technology'
  | 'Furniture'
  | 'Office Supplies'
  | 'Apparel'
  | 'Food and Beverage',
  string[]
> = {
  Technology: ['Phones', 'Computers', 'Tablets'],
  Furniture: ['Chairs', 'Desks', 'Tables'],
  'Office Supplies': ['Pens', 'Paper', 'Binders'],
  Apparel: ['Shirts', 'Pants', 'Shoes'],
  'Food and Beverage': ['Snacks', 'Drinks', 'Candy'],
}

function generateFakeData(numEntries: number) {
  const newData = []
  for (let i = 0; i < numEntries; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)]
    const validStates = regionsAndStates[region]
    const state = validStates[Math.floor(Math.random() * validStates.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const subCategory =
      subCategories[category][
        Math.floor(Math.random() * subCategories[category].length)
      ]
    const sales = Math.floor(Math.random() * 20000) + 1000
    const profit =
      Math.floor(Math.random() * (sales * 0.4)) * (Math.random() < 0.5 ? -1 : 1)
    const orderDate = `${2021 + Math.floor(Math.random() * 3)}/${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}`

    newData.push({
      region: region,
      state: state,
      category: category,
      subCategory: subCategory,
      sales: sales,
      profit: profit,
      orderDate: orderDate,
    })
  }
  return newData
}

const decorators = [
  (Story: StoryFn) => {
    return (
      <div
        style={{
          width: 'clamp(250px, 70vw, 900px)',
          height: 'clamp(150px, 40vh, 600px)',
        }}
      >
        <Story />
      </div>
    )
  },
]

const tableHeaders = [
  { dataKey: 'region', label: 'Region' },
  { dataKey: 'state', label: 'State' },
  { dataKey: 'category', label: 'Category' },
  { dataKey: 'subCategory', label: 'Sub-Category' },
  { dataKey: 'sales', label: 'Sales' },
  { dataKey: 'profit', label: 'Profit' },
  { dataKey: 'orderDate', label: 'Order Date' },
]

export const PivotTable = {
  args: {
    data: generateFakeData(100),
    config: {
      groupBy: ['region', 'state'],
      splitBy: ['category', 'subCategory'],
      aggregates: { sales: 'any', profit: 'any' },
      columns: ['sales', 'profit'],
    },
    headers: tableHeaders,
    title: 'Superstore Table',
    description:
      "This table displays data for sales and profit under each category. It's also grouped based on regions and states, making it useful for comparison purposes.",
  },
  decorators,
}

export const NormalTable = {
  args: {
    data: generateFakeData(100),
    headers: tableHeaders,
    title: 'Superstore Table',
  },
  decorators,
}

export const NoData = {
  args: {
    data: [],
  },
}
