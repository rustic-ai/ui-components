import './vegaLiteViz.css'

import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Stack from '@mui/system/Stack'
import useTheme from '@mui/system/useTheme'
import React, { useEffect, useRef, useState } from 'react'
import { default as VegaEmbed } from 'vega-embed'

import type { VegaLiteData } from '../../types'

/** The `VegaLiteViz` component is a versatile tool for visualizing data using the Vega-Lite grammar. With support for various graphic types, it empowers users to create engaging and informative data visualizations effortlessly. */
function VegaLiteViz(props: VegaLiteData) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState<boolean>(false)
  const rusticTheme: Theme = useTheme()
  const isDarkTheme = rusticTheme.palette.mode === 'dark'
  const defaultFont = rusticTheme.typography.fontFamily
  const tooltipBackgroundColor = rusticTheme.palette.primary.main
  const tooltipTextColor = rusticTheme.palette.background.paper
  const borderRadius = rusticTheme.shape.borderRadius
  const tooltipFontSize = rusticTheme.typography.caption.fontSize
  const tooltipFontWeight = rusticTheme.typography.caption.fontWeight
  const tooltipOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatTooltip: (value: any, sanitize: (value: any) => string) => {
      let tooltipContent = `<div class='rustic-vega-lite-tooltip-content' style="background-color: ${tooltipBackgroundColor}; color: ${tooltipTextColor};border-radius: ${borderRadius}px; padding: 4px 8px; font-size: ${tooltipFontSize}; font-family: ${defaultFont}; font-weight: ${tooltipFontWeight};">`

      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          tooltipContent += `<strong>${sanitize(key)}:</strong> ${sanitize(value[key])}<br />`
        }
      }
      tooltipContent += '</div>'
      return tooltipContent
    },
    disableDefaultStyle: true,
    //need this id to hide and show tooltip
    id: 'rustic-vega-lite-tooltip',
  }

  function renderChart() {
    if (chartRef.current && props.spec) {
      const options = {
        config: { font: defaultFont },
        ...props.options,
        theme: isDarkTheme ? props.theme?.dark : props.theme?.light,
        tooltip: tooltipOptions,
      }

      if (!props.options?.config?.font) {
        options.config.font = defaultFont
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

  useEffect(() => {
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
