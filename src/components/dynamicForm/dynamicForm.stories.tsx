import UniformsForm from './uniformsForm'

export default {
  title: 'Rustic UI/Dynamic Form/UniformsForm',
  component: UniformsForm,
  tags: ['autodocs'],
  argTypes: {
    updatedData: {
      description: 'Form response to be rendered.',
    },
  },
  parameters: {
    layout: 'centered',
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
  },
}

export const SubmittedForm = {
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
    data: {
      city: 'Vancouver',
      state: 'BC',
      street: '1575 W Georgia St',
      zip: 'V6G 2V3',
    },
  },
}
