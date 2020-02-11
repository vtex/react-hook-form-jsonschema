import React from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { MockObject } from '../../__mocks__/mockObjectComponent'
import { FormContext } from '../../components'
import mockObjectSchema from '../__mocks__/mockSchema'
import { UISchemaType, UITypes } from '../types'

const mockUISchema: UISchemaType = {
  type: UITypes.default,
  properties: {
    stringTest: {
      type: UITypes.radio,
    },
    numberTest: {
      type: UITypes.select,
    },
  },
}

test('should render all child properties of the schema', () => {
  const { getByText } = render(
    <FormContext schema={mockObjectSchema}>
      <MockObject path="$" />
    </FormContext>
  )

  expect(getByText('stringTest')).toBeDefined()
  expect(getByText('integerTest')).toBeDefined()
  expect(getByText('numberTest')).toBeDefined()
  expect(getByText('booleanTest')).toBeDefined()
  expect(getByText('errorTest')).toBeDefined()
})

test('should raise error', async () => {
  const { getByText } = render(
    // esling-disable-next-line no-console
    <FormContext
      schema={mockObjectSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockObject path="$/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})

test('ui schema should render number and input as select', async () => {
  const { getByText } = render(
    <FormContext schema={mockObjectSchema}>
      <MockObject path="$" UISchema={mockUISchema} />
    </FormContext>
  )

  expect(getByText('0')).toBeDefined()
  expect(getByText('0.1')).toBeDefined()
  expect(getByText('0.2')).toBeDefined()
  expect(getByText('0.3')).toBeDefined()
  expect(getByText('0.4')).toBeDefined()
  expect(getByText('0.5')).toBeDefined()
})
