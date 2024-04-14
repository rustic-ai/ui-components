import 'ol/ol.css'

import OpenLayersMap from './openLayersMap'

const meta = {
  title: 'Rustic UI/Map/Open Layers Map',
  component: OpenLayersMap,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `OpenLayersMap` component supports OpenStreetMap tiles where users can easily zoom in and zoom out to navigate the map effectively. The `OpenLayersMap` component uses the [OpenLayers](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html) map library.\n\nHeight and width are configured through the class `rustic-open-layers-map-canvas`.\n\nNote: If you are not seeing the component or come across the error "An error occurred while loading the map", ensure that `@import \'@rustic-ai/ui-components/dist/index.css\';` is at the top of your `index.css` file.',
      },
    },
  },
}

export default meta

export const Default = {
  args: {
    longitude: -123.1115,
    latitude: 49.2856,
  },
}

export const CustomizedZoom = {
  args: {
    longitude: -123.1115,
    latitude: 49.2856,
    zoom: 15,
  },
}

export const InvalidCoordinates = {
  args: {
    longitude: -181,
    latitude: 49.2856,
  },
}
