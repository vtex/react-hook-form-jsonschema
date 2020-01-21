const mockSchema = {
  type: 'object',
  required: ['errorTest'],
  properties: {
    stringTest: {
      type: 'string',
      name: 'test-useSelectString',
      enum: ['this', 'tests', 'the', 'useSelect', 'hook'],
    },
    integerTest: {
      type: 'integer',
      name: 'test-useSelectInteger',
      minimum: 0,
      maximum: 10,
      multipleOf: 1,
    },
    numberTest: {
      type: 'number',
      name: 'test-useSelectNumber',
      minimum: 0,
      maximum: 10,
      multipleOf: 0.1,
    },
    booleanTest: {
      type: 'boolean',
      name: 'test-useSelectBoolean',
    },
    errorTest: {
      type: 'string',
      name: 'test-showError',
      enum: ['should', 'show', 'error', 'when', 'submitted'],
    },
  },
}

export default mockSchema
