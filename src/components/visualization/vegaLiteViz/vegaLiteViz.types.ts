import type { Renderers } from 'vega'
import type { EmbedOptions, VisualizationSpec } from 'vega-embed'

import type { GetAuthHeaders, Updates, VisualizationFormat } from '../../types'

//VegaLite's typescript doesn't recognize font as a valid props
type VegaLiteOptions = EmbedOptions<string, Renderers> & {
  config?: EmbedOptions['config'] & {
    font?: string
  }
}

export interface VegaLiteFormat extends VisualizationFormat {
  /** Follow Vega-lite's [documentation](https://vega.github.io/vega-lite/) to provide a specification object. Schema should be included in the spec. Need to use 'container' for width or height for responsive chart. */
  spec: VisualizationSpec
  theme: {
    light?: VegaLiteOptions['theme']
    dark: VegaLiteOptions['theme']
  }
  options?: VegaLiteOptions
}

export type VegaLiteData = VegaLiteFormat & Updates<VegaLiteFormat>

export interface VegaLiteProps extends VegaLiteData {
  /** A function that can be used to get the headers for the data requests. */
  getAuthHeaders?: GetAuthHeaders
}
