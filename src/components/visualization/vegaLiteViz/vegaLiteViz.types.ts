import type { Renderers } from 'vega'
import type { EmbedOptions, VisualizationSpec } from 'vega-embed'

import type { DataFormat, Updates } from '../../types'

//VegaLite's typescript doesn't recognize font as a valid props
type VegaLiteOptions = EmbedOptions<string, Renderers> & {
  config?: EmbedOptions['config'] & {
    font?: string
  }
}

export interface VegaLiteFormat extends DataFormat {
  /** Follow Vega-lite's [documentation](https://vega.github.io/vega-lite/) to provide a specification object. Schema should be included in the spec. Need to use 'container' for width or height for responsive chart. */
  spec: VisualizationSpec
  theme: {
    light?: VegaLiteOptions['theme']
    dark: VegaLiteOptions['theme']
  }
  options?: VegaLiteOptions
}

export type VegaLiteData = VegaLiteFormat & Updates<VegaLiteFormat>
