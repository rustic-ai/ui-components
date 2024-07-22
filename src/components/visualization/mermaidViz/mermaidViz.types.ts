import type { MermaidConfig } from 'mermaid/dist/config.type.js'

import type { Updates, VisualizationFormat } from '../../types'

export interface MermaidFormat extends VisualizationFormat {
  /** Diagram definition following [Mermaid's syntax](https://mermaid.js.org/intro/syntax-reference.html#syntax-structure). The use of [these](https://mermaid.js.org/intro/syntax-reference.html#diagram-breaking) words or symbols can break diagrams. */
  diagram: string
  /** Configuration for altering and customizing Mermaid Diagrams. Refer [Mermaid docs](https://mermaid.js.org/config/schema-docs/config.html) for details. */
  config?: MermaidConfig
}

export type MermaidData = MermaidFormat & Updates<MermaidFormat>
