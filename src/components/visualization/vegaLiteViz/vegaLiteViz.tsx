import './vegaLiteViz.css'

import Typography from '@mui/material/Typography'
import Stack from '@mui/system/Stack'
import useTheme from '@mui/system/useTheme'
import React, { useEffect, useRef, useState } from 'react'
import { default as VegaEmbed } from 'vega-embed'

import type { VegaLiteVizData } from '../../types'

/** The `VegaLiteViz` component is a versatile tool for visualizing data using the Vega-Lite grammar. With support for various graphic types, it empowers users to create engaging and informative data visualizations effortlessly. */
function VegaLiteViz(props: VegaLiteVizData) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState<boolean>(false)
  const isDarkTheme = useTheme().palette.mode === 'dark'

  useEffect(() => {
    function renderChart() {
      if (chartRef.current && props.spec) {
        const options = {
          ...props.options,
          theme: isDarkTheme ? props.theme?.dark : props.theme?.light,
        }

        VegaEmbed(chartRef.current, props.spec, options)
          .then(() => {
            setHasError(false)
          })
          .catch(() => {
            setHasError(true)
          })
      }
    }

    renderChart()

    function handleResize() {
      renderChart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [props.spec, isDarkTheme])

  if (hasError) {
    return <Typography variant="body2">Failed to load the chart.</Typography>
  } else {
    return (
      <Stack direction="column" className="rustic-vega-lite-container">
        {props.title && (
          <Typography variant="subtitle2">{props.title}</Typography>
        )}
        {props.description && (
          <Typography variant="caption">{props.description}</Typography>
        )}
        <div ref={chartRef} className="rustic-vega-lite" data-cy="vega-lite" />
      </Stack>
    )
  }
}

export default VegaLiteViz

VegaLiteViz.defaultProps = {
  theme: {
    dark: 'dark' as const,
  },
}
