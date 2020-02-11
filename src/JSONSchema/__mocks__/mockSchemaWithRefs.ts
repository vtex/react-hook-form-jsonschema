const mockSchema = {
  type: 'object',
  required: ['firstName', 'lastName'],
  $id: 'https://vtex.io/oneSampleschema.json',
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
    },
    age: {
      type: 'number',
      title: 'Age',
      minimum: 18,
      maximum: 100,
      multipleOf: 1,
    },
    address: {
      $ref: '#/definitions/address',
    },
  },
  definitions: {
    address: {
      type: 'object',
      title: 'Address',
      properties: {
        street: {
          $ref: 'streetAddress',
        },
        streetType: {
          $ref: 'https://vtex.io/streetType',
        },
        streetNumber: {
          $ref:
            'https://vtex.io/oneSampleschema.json#/definitions/streetNumber',
        },
      },
    },
    street: {
      type: 'string',
      title: 'Street Address',
      $id: 'streetAddress',
    },
    streetType: {
      type: 'string',
      title: 'Street Type',
      $id: 'streetType',
      enum: ['road', 'boulevard', 'avenue'],
    },
    streetNumber: {
      type: 'integer',
      title: 'Address Number',
      minimum: 0,
    },
  },
}

export default mockSchema
