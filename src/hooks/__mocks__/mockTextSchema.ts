const mockTextSchema = {
  type: 'object',
  required: ['errorTest'],
  properties: {
    stringTest: {
      type: 'string',
      name: 'test-useTextAreaString',
      minLength: 2,
    },
    integerTest: {
      type: 'integer',
      name: 'test-useTextAreaInteger',
      minimum: 0,
      maximum: 10,
      multipleOf: 1,
    },
    numberTest: {
      type: 'number',
      name: 'test-useTextAreaNumber',
      minimum: 0,
      maximum: 10,
      multipleOf: 0.1,
    },
    errorTest: {
      type: 'string',
      name: 'test-showError',
      minLength: 10,
    },
  },
}

export default mockTextSchema
