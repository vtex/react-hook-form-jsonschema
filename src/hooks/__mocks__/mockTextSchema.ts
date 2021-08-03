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
    stringDateTest: {
      type: 'string',
      title: 'test-useInput-format-date',
      format: 'date',
    },
    stringDateTimeTest: {
      type: 'string',
      title: 'test-useInput-format-date-time',
      format: 'date-time',
    },
    stringEmailTest: {
      type: 'string',
      title: 'test-useInput-format-email',
      format: 'email',
    },
    stringHostnameTest: {
      type: 'string',
      title: 'test-useInput-format-hostname',
      format: 'hostname',
    },
    stringUriTest: {
      type: 'string',
      title: 'test-useInput-format-uri',
      format: 'uri',
    },
  },
}

export default mockTextSchema
