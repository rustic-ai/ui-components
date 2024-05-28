import SvgRenderer from './svgRenderer'

export default {
  title: 'Rustic UI/Image/SVG Renderer',
  component: SvgRenderer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `SVGRenderer` component is a flexible and secure React component designed to render SVG code provided as a string. It ensures that the SVG content is sanitized to prevent any potential security risks, making it safe to use with dynamic or externally-sourced SVG code.',
      },
    },
  },
}

const svgCode = `<svg viewbox='0 0 400 400' xmlns='http://www.w3.org/2000/svg' height='60vmin' width='60vmin'>
<rect x='0' y='0' width='50%' height='50%' fill='tomato' opacity='0.75' />
<rect x='25%' y='25%' width='50%' height='50%' fill='slategrey' opacity='0.75' />
<rect x='50%' y='50%' width='50%' height='50%' fill='olive' opacity='0.75' />
<rect x='0' y='0' width='100%' height='100%' stroke='cadetblue' stroke-width='0.5%' fill='none' />
</svg>`

export const Default = {
  args: {
    title: 'How many boxes are there?',
    description: 'This is rendered SVG.',
    code: svgCode,
  },
}
