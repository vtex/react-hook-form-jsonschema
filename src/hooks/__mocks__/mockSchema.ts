export const toFixed = (value: number, precision: number): string => {
  const power = Math.pow(10, precision || 0)
  return String(Math.round(value * power) / power)
}

const mockSchema = {
  type: 'object',
  required: ['errorTest'],
  properties: {
    stringTest: {
      type: 'string',
      title: 'test-useSelectString',
      enum: ['this', 'tests', 'the', 'useSelect', 'hook'],
    },
    integerTest: {
      type: 'integer',
      title: 'test-useSelectInteger',
      minimum: 0,
      maximum: 6,
      multipleOf: 2,
    },
    numberTest: {
      type: 'number',
      title: 'test-useSelectNumber',
      minimum: 0,
      maximum: 0.5,
      multipleOf: 0.1,
    },
    booleanTest: {
      type: 'boolean',
      title: 'test-useSelectBoolean',
    },
    errorTest: {
      type: 'string',
      title: 'test-showError',
      enum: ['should', 'show', 'error', 'when', 'submitted'],
    },
  },
}

export default mockSchema
