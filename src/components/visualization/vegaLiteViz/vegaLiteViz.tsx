import './vegaLiteViz.css'

import type { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import Stack from '@mui/system/Stack'
import useTheme from '@mui/system/useTheme'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as vega from 'vega'
import { default as VegaEmbed } from 'vega-embed'

import MarkedMarkdown from '../../markdown/markedMarkdown'
import PopoverMenu, { type PopoverMenuItem } from '../../menu/popoverMenu'
import type { VegaLiteProps } from './vegaLiteViz.types'

/** The `VegaLiteViz` component is a versatile tool for visualizing data using the Vega-Lite grammar. With support for various graphic types, it empowers users to create engaging and informative data visualizations effortlessly.
 *
 * Note: `vega-embed` is not bundled, so please install the following package using npm:
 *
 * ```typescript
 * npm i vega-embed
 * ```
 */
function VegaLiteViz({
  theme = {
    dark: 'dark' as const,
  },
  ...props
}: VegaLiteProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState<boolean>(false)

  const rusticTheme: Theme = useTheme()
  const isDarkTheme = rusticTheme.palette.mode === 'dark'
  const defaultFont = rusticTheme.typography.fontFamily

  const customHttpLoader = (
    url: string,
    options: RequestInit
  ): Promise<string> => {
    const axiosOptions = {
      method: (options.method as string) || 'GET',
      headers: options.headers as Record<string, string>,
      responseType: 'text' as const,
      data: options.body,
    }

    let updateRequestHeaders

    if (props.getAuthHeaders) {
      updateRequestHeaders = props.getAuthHeaders().then((authData) => {
        axiosOptions.headers = {
          ...axiosOptions.headers,
          ...authData.headers,
        }
        return axiosOptions
      })
    } else {
      updateRequestHeaders = Promise.resolve(axiosOptions)
    }

    return updateRequestHeaders
      .then((finalOptions) => {
        return axios(url, finalOptions)
      })
      .then((response) => {
        return response.data
      })
  }

  function createLoader(): vega.Loader {
    const loader = vega.loader()

    if (props.getAuthHeaders) {
      loader.http = customHttpLoader
    }

    return loader
  }

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

  function renderChart() {
    if (chartRef.current && props.spec) {
      const options = {
        config: { font: defaultFont },
        ...props.options,
        theme: isDarkTheme ? theme.dark : theme.light,
        tooltip: tooltipOptions,
        actions: false,
        loader: createLoader(),
      }

      if (!props.options?.config?.font) {
        options.config.font = defaultFont
      }
      const specToRender = { ...props.spec }
      delete specToRender.title
      VegaEmbed(chartRef.current, specToRender, options)
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

        {props.title && <Typography variant="h6">{props.title}</Typography>}
        {props.description && <MarkedMarkdown text={props.description} />}
        <Box textAlign="center" mt={1}>
          {typeof props.spec.title === 'string' && (
            <Typography variant="subtitle2">{props.spec.title}</Typography>
          )}
          {props.spec.description && (
            <Typography variant="caption">{props.spec.description}</Typography>
          )}
        </Box>
        <div ref={chartRef} className="rustic-vega-lite" data-cy="vega-lite" />
      </Stack>
    )
  }
}

export default VegaLiteViz
