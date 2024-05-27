import './vegaLiteViz.css'

import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import Stack from '@mui/system/Stack'
import useTheme from '@mui/system/useTheme'
import React, { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { default as VegaEmbed } from 'vega-embed'

import PopoverMenu from '../../menu/popoverMenu'
import type { VegaLiteData } from '../../types'

/** The `VegaLiteViz` component is a versatile tool for visualizing data using the Vega-Lite grammar. With support for various graphic types, it empowers users to create engaging and informative data visualizations effortlessly. */
function VegaLiteViz(props: VegaLiteData) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState<boolean>(false)
  const [downloadUrls, setDownloadUrls] = useState<downloadUrls>()

  const rusticTheme: Theme = useTheme()
  const isDarkTheme = rusticTheme.palette.mode === 'dark'
  const defaultFont = rusticTheme.typography.fontFamily

  const tooltipStyle = {
    backgroundColor: rusticTheme.palette.primary.main,
    color: rusticTheme.palette.background.paper,
    borderRadius: rusticTheme.shape.borderRadius + 'px',
    padding: '4px 8px',
    fontSize: rusticTheme.typography.caption.fontSize,
    fontFamily: defaultFont,
    fontWeight: rusticTheme.typography.caption.fontWeight,
  }

  const tooltipOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatTooltip: (value: any, sanitize: (value: any) => string) =>
      renderToStaticMarkup(
        <div
          role="tooltip"
          className="rustic-vega-lite-tooltip-content"
          style={tooltipStyle}
        >
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <strong>{sanitize(key)}:</strong> {sanitize(val)}
            </div>
          ))}
        </div>
      ),
    disableDefaultStyle: true,
    //need this id to hide and show tooltip
    id: 'rustic-vega-lite-tooltip',
  }

  function handleDownload(
    format: 'svg' | 'png',
    url?: string,
    fileName?: string
  ) {
    if (url) {
      // Create a temporary anchor element
      const link = document.createElement('a')
      const downloadFileName = fileName || 'visualization'

      link.href = url
      link.download = `${downloadFileName}.${format}`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const menuItem = [
    {
      label: 'Save as SVG',
      onClick: () => handleDownload('svg'),
    },
    {
      label: 'Save as PNG',
      onClick: () => handleDownload('png'),
    },
  ]

  function getScaleFactor(format: 'svg' | 'png') {
    const scaleFactor = props.options?.scaleFactor
    if (scaleFactor) {
      if (typeof scaleFactor === 'number') {
        return scaleFactor
      } else {
        return scaleFactor[format]
      }
    }
  }

  function renderChart() {
    if (chartRef.current && props.spec) {
      const options = {
        config: { font: defaultFont },
        ...props.options,
        theme: isDarkTheme ? props.theme?.dark : props.theme?.light,
        tooltip: tooltipOptions,
        actions: false,
      }

      if (!props.options?.config?.font) {
        options.config.font = defaultFont
      }

      VegaEmbed(chartRef.current, props.spec, options)
        .then((result) => {
          result.view.toImageURL('svg', getScaleFactor('svg')).then((url) => {
            menuItem[0].onClick = () =>
              handleDownload('svg', url, options.downloadFileName)
          })

          result.view.toImageURL('png', getScaleFactor('png')).then((url) => {
            menuItem[1].onClick = () =>
              handleDownload('png', url, options.downloadFileName)
          })
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
        <Box justifyContent="end" display="flex">
          <PopoverMenu menuItems={menuItem} ariaLabel="menu" />
        </Box>

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
