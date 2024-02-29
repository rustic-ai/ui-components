import { Source, Meta } from '@storybook/addon-docs'

<Meta title="Documentation/Usage" />

# Usage

## Use ElementRenderer to Render Components

The core component of our library, `ElementRenderer`, dynamically renders other multimodal components based on data format. It simplifies the process of displaying diverse types of content within your application by abstracting away the complexity of handling different formats and rendering logic.

### Benefits of Using ElementRenderer:

**Dynamic Rendering**: `ElementRenderer` enables dynamic rendering of content based on message formats, eliminating the need for manual switching or conditional rendering based on message types.

**Modularity and Extensibility**: By separating the rendering logic into individual components and using a component map, `ElementRenderer` promotes modularity and allows for easy extension or customization of supported formats.

**Consistency and Maintainability**: `ElementRenderer` ensures consistency in rendering across different message formats, making it easier to maintain and update rendering logic centrally.

**Scalability**: As your application grows and evolves, `ElementRenderer` scales with it, accommodating new message formats and components seamlessly.

For more information, refer to the `ElementRenderer` documentation in Storybook.

## Use MessageList to Render Messages

MessageList simplifies the integration of multimodal components into your application. Leveraging the capabilities of ElementRenderer, it efficiently renders a list of messages by accepting the necessary props.

```
<MessageList messages={messages} supportedElements={supportedElements} messageInteractions={messageInteractions} />
```

Ensure that your data conforms to the data structure outlined in the MessageList documentation to ensure proper rendering and functionality.

## Render Components Without ElementRenderer

If you don't want to use `ElementRenderer` to render components, you can incorporate UI components into your application just like any other React component. Refer to Storybook for the available props you can pass to each component. Here's an example of how to use the `RechartsTimeSeries` component:

```
import { RechartsTimeSeries } from '@rustic-ai/ui-components';

// Define your data and formatters
const yourTimeSeriesData = [
  // Your time series data
];

const yourYAxisTickFormatter = (value) => `${value}M`; // Example formatter
const yourTooltipFormatter = (value, name) => [`${value}M`, name]; // Example formatter
const yourChartContainerMargin = { top: 20, left: 25, right: 25, bottom: 20 }; // Example margin

function YourComponent() {
  return (
    <RechartsTimeSeries
      title="Your Chart Title"
      description="Your Description"
      timeSeries={yourTimeSeriesData}
      yAxisTickFormatter={yourYAxisTickFormatter}
      tooltipFormatter={yourTooltipFormatter}
      chartContainerMargin={yourChartContainerMargin}
    />
  );
}

export default YourComponent;
```

### Extending Components

To extend a component, you can create a new component that inherits properties and functionality from the base component while adding new features or customizing existing behavior.

Here's an example of how you can extend a component:

```
import Box from '@mui/material/Box'
import React from 'react'


import Image, { ImageProps } from './image'


interface ExtendedImageProps extends ImageProps {
 borderRadius?: string
}


const ExtendedImage: React.FC<ExtendedImageProps> = ({
 borderRadius,
 ...props
}) => {
 // Customize behavior or add new features
 return (
   <Box borderRadius={borderRadius} overflow="hidden" position="relative">
     <Image {...props} />

   </Box>
 )
}


export default ExtendedImage
```

In this extension:

- We create a new interface `ExtendedImageProps` that extends `ImageProps` and adds an optional `borderRadius` prop.
- We create a new functional component `ExtendedImage` that accepts props of type `ExtendedImageProps`.
- Inside the `ExtendedImage` component, we customize the behavior by wrapping the `Image` component inside a `Box` component to allow customizing the border radius and overflow behavior.
- We render the `Image` component with the extended props.

**Note**: If the extended component is going to be displayed as a message, please remember to add the extended component to the `supportedElements.json` file so that the component can be rendered successfully. Otherwise, the message containing your extended component will be displayed as ‘unsupported data format’.

You can use the `ExtendedImage` component in your application like any other React component:

```jsx
<ExtendedImage url="your-image-url" borderRadius="10px" />
```

This will render the image with a border radius of 10px and inherit default width, height, and alt props from the Image component. You can also override these props as needed when using the ExtendedImage component.
