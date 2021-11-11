export const toFixed = (value: number, precision: number): string => {
  const power = Math.pow(10, precision || 0)
  return String(Math.round(value * power) / power)
}

const mockSchema = {
  type: 'object',
  required: ['errorTest', 'arrayErrorTest'],
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
    integerEnumTest: {
      type: 'integer',
      title: 'test-useSelectIntegerEnum',
      enum: [0, 1, 2, 3, 5, 7, 11, 13],
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
    arrayErrorTest: {
      type: 'array',
      items: {
        enum: ['should', 'show', 'error', 'when', 'submitted'],
      },
      minItems: 1,
    },
  },
}

export default mockSchema
