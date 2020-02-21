import React from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { FormContext } from '../../components'
import { UISchemaType, UITypes } from '../../hooks'
import mockObjectSchema from '../../hooks/__mocks__/mockSchema'
import { MockObject } from '../../__mocks__/mockObjectComponent'
import { deepFreeze } from '../__mocks__/deepFreeze'

const mockUISchema: UISchemaType = {
  type: UITypes.default,
  properties: {
    numberTest: {
      type: UITypes.select,
    },
  },
}

const frozenSchema = deepFreeze(mockObjectSchema)
test('should render all child properties of the schema', async () => {
  const { getByText } = render(
    <FormContext
      schema={frozenSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockObject pointer="#" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  expect(getByText('stringTest')).toBeDefined()
  expect(getByText('integerTest')).toBeDefined()
  expect(getByText('numberTest')).toBeDefined()
  expect(getByText('booleanTest')).toBeDefined()
  expect(getByText('errorTest')).toBeDefined()

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})

test('should raise error', async () => {
  const { getByText } = render(
    // esling-disable-next-line no-console
    <FormContext
      schema={frozenSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockObject pointer="#/properties/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})

test('ui schema should render number and input as select', async () => {
  const { getByText } = render(
    <FormContext schema={frozenSchema}>
      <MockObject pointer="#" UISchema={mockUISchema} />
    </FormContext>
  )

  expect(getByText('0')).toBeDefined()
  expect(getByText('0.1')).toBeDefined()
  expect(getByText('0.2')).toBeDefined()
  expect(getByText('0.3')).toBeDefined()
  expect(getByText('0.4')).toBeDefined()
  expect(getByText('0.5')).toBeDefined()
})
