import 'ol/ol.css'

import OpenLayersMap from './openLayersMap'

const meta = {
  title: 'Rustic UI/Map/Open Layers Map',
  component: OpenLayersMap,
  tags: ['autodocs'],
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
