import type {Updates, VisualizationFormat} from "../../types";
import type {PlotParams} from "react-plotly.js";

/** Follow [Plotly's documentation](https://plotly.com/javascript/reference/index/) to provide a valid Plotly JSON.
 * Note: It excludes the `divId` field **/
export type PlotlyJson = Omit<PlotParams, "divId">

export interface PlotlyGraphFormat extends VisualizationFormat {
    plotParams: PlotlyJson,
}

export type PlotlyGraphData = PlotlyGraphFormat & Updates<PlotlyGraphFormat>