import './vegaLiteChart.css'

import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { default as embed } from 'vega-embed'

import type { VegaLiteChartData } from '../../types'

/** The `VegaLiteChart` component is a versatile tool for visualizing data using the Vega-Lite grammar. With support for various chart types, it empowers users to create engaging and informative data visualizations effortlessly. */
function VegaLiteChart(props: VegaLiteChartData) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    if (chartRef.current && props.spec) {
      embed(chartRef.current, props.spec)
        .then(() => {
          hasError && setHasError(false)
        })
        .catch(() => {
          setHasError(true)
        })
    }
  }, [])

  if (hasError) {
    return <Typography variant="body2">Failed to load the chart.</Typography>
  } else {
    return (
      <div
        ref={chartRef}
        className="rustic-responsive-chart"
        data-cy="vage-lite-chart"
      />
    )
  }
}

export default VegaLiteChart
