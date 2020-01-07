export default {
  title: 'Person',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      description: "The person's first name.",
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      description: "The person's last name.",
    },
    age: {
      description: 'Age in years which must be equal to or greater than zero.',
      title: 'Age',
      type: 'integer',
      minimum: 0,
      maximum: 120,
    },
    height: {
      type: 'number',
      minimum: 0.8,
      maximum: 2.9,
      title: 'Your height in meters',
      multipleOf: 0.01,
    },
    emailAddress: {
      type: 'string',
      format: 'email',
      title: 'Email address',
    },
    address: {
      title: 'Address',
      type: 'object',
      properties: {
        streetType: {
          type: 'string',
          title: 'Street Type',
          enum: ['street', 'road', 'avenue', 'boulevard'],
        },
        streetAddress: {
          type: 'string',
          title: 'Address',
        },
        streetNumber: {
          type: 'integer',
          title: 'Street Number',
        },
      },
      required: ['streetType', 'streetAddress', 'streetNumber'],
    },
    agreement: {
      type: 'boolean',
      title: 'Do you agree with the terms?',
    },
  },
  required: ['firstName', 'lastName'],
}
