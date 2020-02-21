import React, { FC } from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { useSelect } from '../useSelect'
import { FormContext } from '../../components'
import mockSelectSchema, { toFixed } from '../__mocks__/mockSchema'

const MockSelect: FC<{ pointer: string }> = props => {
  const methods = useSelect(props.pointer)

  return (
    <>
      <label {...methods.getLabelProps()}>{methods.name}</label>
      <select {...methods.getSelectProps()}>
        {methods.getItems().map((value, index) => {
          return (
            <option
              {...methods.getItemOptionProps(index)}
              key={`${value}${index}`}
            >
              {value}
            </option>
          )
        })}
      </select>
      {methods.getError() && <p>This is an error!</p>}
    </>
  )
}

test('should have string enum items', () => {
  const { getByText } = render(
    <FormContext schema={mockSelectSchema}>
      <MockSelect pointer="#/properties/stringTest" />
    </FormContext>
  )

  for (const item of mockSelectSchema.properties.stringTest.enum) {
    expect(getByText(item)).toBeDefined()
  }
})

test('should have all integers in interval', () => {
  const { getByText } = render(
    <FormContext schema={mockSelectSchema}>
      <MockSelect pointer="#/properties/integerTest" />
    </FormContext>
  )

  expect(getByText('0')).toBeDefined()
  expect(getByText('2')).toBeDefined()
  expect(getByText('4')).toBeDefined()
  expect(getByText('6')).toBeDefined()
})

test('should have all floats in interval, separated by step', () => {
  const { getByText } = render(
    <FormContext schema={mockSelectSchema}>
      <MockSelect pointer="#/properties/numberTest" />
    </FormContext>
  )

  expect(getByText('0')).toBeDefined()
  expect(getByText('0.1')).toBeDefined()
  expect(getByText('0.2')).toBeDefined()
  expect(getByText('0.3')).toBeDefined()
  expect(getByText('0.4')).toBeDefined()
  expect(getByText('0.5')).toBeDefined()
})

test('should have boolean true and false', () => {
  const { getByText } = render(
    <FormContext schema={mockSelectSchema}>
      <MockSelect pointer="#/properties/booleanTest" />
    </FormContext>
  )

  expect(getByText('true')).toBeDefined()
  expect(getByText('false')).toBeDefined()
})

test('should raise error', async () => {
  const { getByText } = render(
    // esling-disable-next-line no-console
    <FormContext
      schema={mockSelectSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockSelect pointer="#/properties/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})
