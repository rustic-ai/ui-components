import 'ol/ol.css'

import OpenLayersMap from './openLayersMap'

const meta = {
  title: 'Rustic UI/Map/Open Layers Map',
  component: OpenLayersMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `OpenLayersMap` component supports OpenStreetMap tiles and offers customization options for width, height, and marker size. Users can easily zoom in and zoom out to navigate the map effectively. The `OpenLayersMap` component uses the [OpenLayers](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html) map library.',
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

export const Customized = {
  args: {
    longitude: -123.1115,
    latitude: 49.2856,
    zoom: 15,
    width: 500,
    height: 300,
  },
}

export const InvalidCoordinates = {
  args: {
    longitude: -181,
    latitude: 49.2856,
  },
}
