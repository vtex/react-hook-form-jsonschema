import React from 'react'
import { render } from '@vtex/test-tools/react'

import { FormContext } from '../../components'
import mockObjectSchema from '../__mocks__/mockSchemaWithRefs'
import { MockObject } from '../../__mocks__/mockObjectComponent'
import { deepFreeze } from '../__mocks__/deepFreeze'

// Ensures there is no modification to base schema
test('should render all child properties of the schema', async () => {
  const { getByText } = render(
    <FormContext schema={mockObjectSchema}>
      <MockObject pointer="#" />
    </FormContext>
  )

  expect(getByText('firstName')).toBeDefined()
  expect(getByText('lastName')).toBeDefined()
  expect(getByText('age')).toBeDefined()
  expect(getByText('street')).toBeDefined()
  expect(getByText('streetType')).toBeDefined()
  expect(getByText('streetNumber')).toBeDefined()
  expect(getByText('zipCode')).toBeDefined()
})

test('should render all child properties of the schema even if frozen', async () => {
  const mockSchema = deepFreeze(mockObjectSchema)
  const { getByText } = render(
    <FormContext schema={mockSchema}>
      <MockObject pointer="#" />
    </FormContext>
  )

  expect(getByText('firstName')).toBeDefined()
  expect(getByText('lastName')).toBeDefined()
  expect(getByText('age')).toBeDefined()
  expect(getByText('street')).toBeDefined()
  expect(getByText('streetType')).toBeDefined()
  expect(getByText('streetNumber')).toBeDefined()
  expect(getByText('zipCode')).toBeDefined()
})
