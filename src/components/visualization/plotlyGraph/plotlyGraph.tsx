import React from 'react';
import Plot from 'react-plotly.js'
import type {PlotlyGraphData} from "./plotlyGraph.types";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";

/** The `PlotlyGraph` component enables interactive charts and maps using [Plotly](https://plotly.com/javascript/).
 *
 * Note: Required dependencies are not bundled, so please install them using npm:
 *
 * ```typescript
 * npm i react-plotly.js plotly.js
 * ```
 */
export function PlotlyGraph(props: PlotlyGraphData) {

    const additionalConfig = {
        displaylogo: false,
        responsive: true,
        editable: false,
    }

    const plotParams = {...props.plotParams, className: 'rustic-plotly'}
    plotParams.config = {...plotParams.config, ...additionalConfig}

    return (
        <Box mt={1} className={'rustic-plotly-container'} data-cy="plotly">
            {props.title && <Typography variant="h6">{props.title}</Typography>}
            {props.description && (
                <Typography variant="body1">{props.description}</Typography>
            )}
            <Plot {...plotParams}></Plot>
        </Box>
    )
}