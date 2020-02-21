import { getObjectFromForm } from '../logic'

test('should return an object that matches the schema', () => {
  const mockJSONSchema = {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
      middleName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      address: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
          },
          street: {
            type: 'string',
          },
          streetNumber: {
            type: 'integer',
          },
        },
      },
    },
  }
  const mockData = {
    '#/properties/firstName': 'Jane',
    '#/properties/lastName': 'Doe',
    '#/properties/address/properties/city': 'RJ',
    '#/properties/address/properties/street': 'Praia de Botafogo',
    '#/properties/address/properties/streetNumber': 300,
    '#/properties/middleName': null,
    '#/properties/intruderField':
      'I am an intruder, you should not return me :)',
  }

  const testResult = getObjectFromForm(mockJSONSchema, mockData)

  expect(testResult).toEqual({
    firstName: 'Jane',
    lastName: 'Doe',
    address: {
      city: 'RJ',
      street: 'Praia de Botafogo',
      streetNumber: 300,
    },
  })
})
