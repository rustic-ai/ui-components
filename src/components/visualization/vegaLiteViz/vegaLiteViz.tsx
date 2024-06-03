import './vegaLiteViz.css'

import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import Stack from '@mui/system/Stack'
import useTheme from '@mui/system/useTheme'
import React, { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { default as VegaEmbed } from 'vega-embed'

import PopoverMenu, { type PopoverMenuItem } from '../../menu/popoverMenu'
import type { VegaLiteData, VegaLiteSpec } from '../../types'

/** The `VegaLiteViz` component is a versatile tool for visualizing data using the Vega-Lite grammar. With support for various graphic types, it empowers users to create engaging and informative data visualizations effortlessly. */
function VegaLiteViz(props: VegaLiteData) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState<boolean>(false)

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

  const menuItems: PopoverMenuItem[] = [
    {
      label: 'Save as SVG',
    },
    {
      label: 'Save as PNG',
    },
  ]

  function splitTextIntoLines(
    text: string,
    maxWidth: number,
    context: CanvasRenderingContext2D
  ) {
    if (context.measureText(text).width <= maxWidth) {
      return text
    }

    const words = text.split(' ')
    const splitedText = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = context.measureText(currentLine + ' ' + word).width

      if (width < maxWidth) {
        currentLine += ' ' + word
      } else {
        splitedText.push(currentLine)
        currentLine = word
      }
    }
    splitedText.push(currentLine)

    return splitedText
  }

  function processTitle(spec: VegaLiteSpec) {
    if (spec.title) {
      const defaultTitleFontSize = 13
      const chartWidth = chartRef.current ? chartRef.current.offsetWidth : 0
      const maxWidth = typeof spec.width === 'number' ? spec.width : chartWidth

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (context) {
        context.letterSpacing = '1px'
        if (typeof spec.title === 'string') {
          const defaultFontStyle = `bold ${defaultTitleFontSize}px ${defaultFont}`
          context.font = defaultFontStyle
          spec.title = splitTextIntoLines(spec.title, maxWidth, context)
        } else if (!Array.isArray(spec.title)) {
          if (typeof spec.title.text === 'string') {
            const font = spec.title.font || defaultFont
            const fontSize = spec.title.fontSize || defaultTitleFontSize
            const fontWeight = spec.title.fontWeight || 'bold'
            const fontStyle = `${fontWeight} ${fontSize}px ${font}`
            context.font = fontStyle

            spec.title.text = splitTextIntoLines(
              spec.title.text,
              maxWidth,
              context
            )
          }
        }
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

      const spec = { ...props.spec }

      processTitle(spec)

      VegaEmbed(chartRef.current, spec, options)
        .then((result) => {
          const opts = result.embedOptions
          const fileName =
            result.embedOptions.downloadFileName || 'visualization'
          const formats: Array<'svg' | 'png'> = ['svg', 'png']

          formats.map((format, index) => {
            const scaleFactor =
              typeof opts.scaleFactor === 'object'
                ? opts.scaleFactor[format]
                : opts.scaleFactor

            result.view.toImageURL(format, scaleFactor).then((url) => {
              menuItems[index].href = url
              menuItems[index].downloadFileName = `${fileName}.${format}`
            })
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
          <PopoverMenu menuItems={menuItems} ariaLabel="Download options" />
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
