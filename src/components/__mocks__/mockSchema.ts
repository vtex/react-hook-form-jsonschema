const mockSchema = {
  $id: 'https://example.com/mock.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Mock',
  type: 'object',
  properties: {
    firstField: {
      type: 'string',
      description: 'The first field.',
      title: 'First field',
    },
    secondField: {
      type: 'string',
      description: 'The second field.',
      title: 'Second field',
    },
    thirdField: {
      type: 'string',
      description: 'The third field.',
      title: 'Third field',
    },
  },
}

export default mockSchema
