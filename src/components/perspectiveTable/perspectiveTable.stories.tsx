import type { TableData } from '@finos/perspective'
import React, { useEffect, useState } from 'react'

import PerspectiveTable from './perspectiveTable'

function fetchArrowData() {
  return fetch('files/superstore.lz4.arrow').then((response) =>
    response.arrayBuffer()
  )
}

export default {
  title: 'Rustic UI/Perspective Table/Perspective Table',
  component: PerspectiveTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

const parentContainerStyle = {
  width: 'clamp(250px, 80vw, 900px)',
  height: 'clamp(150px, 80vh, 800px)',
}

export const PivotTable = () => {
  const [arrowData, setArrowData] = useState<TableData>()

  useEffect(() => {
    fetchArrowData()
      .then((data) => {
        setArrowData(data)
      })
      .catch((error) => {
        console.error('Failed to fetch data', error)
      })
  }, [])

  if (arrowData) {
    return (
      <div style={parentContainerStyle}>
        <PerspectiveTable
          data={arrowData}
          config={{
            group_by: ['Region', 'State'],
            split_by: ['Category', 'Sub-Category'],
            columns: ['Sales', 'Profit'],
          }}
          title="Superstore Table"
          description="This table displays data for sales and profit under each category. It's also grouped based on regions and states, making it useful for comparison purposes."
        />
      </div>
    )
  }
}

export const NormalTable = () => {
  const [arrowData, setArrowData] = useState<TableData>()

  useEffect(() => {
    fetchArrowData()
      .then((data) => {
        setArrowData(data)
      })
      .catch((error) => {
        console.error('Failed to fetch data', error)
      })
  }, [])

  if (arrowData) {
    return (
      <div style={parentContainerStyle}>
        <PerspectiveTable data={arrowData} title="Superstore Table" />
      </div>
    )
  }
}

export const Error = {
  args: {
    data: 'wrongData',
  },
}
