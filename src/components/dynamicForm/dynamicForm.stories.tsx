import { optionalWsDescription } from '../sharedDescription'
import UniformsForm from './uniformsForm'

export default {
  title: 'Rustic UI/Dynamic Form/UniformsForm',
  component: UniformsForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    ws: optionalWsDescription,
  },
}

export const Default = {
  args: {
    title: 'Provide a delivery address',
    schema: {
      title: 'Address',
      type: 'object',
      properties: {
        city: { type: 'string' },
        state: { type: 'string' },
        street: { type: 'string' },
        zip: { type: 'string', pattern: '[0-9]{5}' },
      },
      required: ['street', 'zip', 'state'],
    },
    ws: { send: () => {} },
  },
}

export const Meeting = {
  args: {
    title: 'Choose the days',
    schema: {
      title: 'Meeting Days',
      type: 'object',
      properties: {
        monday: { type: 'boolean' },
        tuesday: { type: 'boolean' },
        wednesday: { type: 'boolean' },
        thursday: { type: 'boolean' },
        friday: { type: 'boolean' },
        saturday: { type: 'boolean' },
        sunday: { type: 'boolean' },
      },
    },
    ws: { send: () => {} },
  },
}

export const ReadOnly = {
  args: {
    title: 'Choose the days',
    schema: {
      title: 'Meeting Days',
      type: 'object',
      properties: {
        monday: { type: 'boolean' },
        tuesday: { type: 'boolean' },
        wednesday: { type: 'boolean' },
        thursday: { type: 'boolean' },
        friday: { type: 'boolean' },
        saturday: { type: 'boolean' },
        sunday: { type: 'boolean' },
      },
    },
    data: {
      thursday: true,
    },
  },
}
