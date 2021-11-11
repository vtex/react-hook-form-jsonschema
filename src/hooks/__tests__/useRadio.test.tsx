import React, { FC } from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { useRadio } from '../useRadio'
import { FormContext } from '../../components'
import mockRadioSchema, { toFixed } from '../__mocks__/mockSchema'

const MockRadio: FC<{ pointer: string }> = props => {
  const methods = useRadio(props.pointer)

  return (
    <label {...methods.getLabelProps()}>
      {methods.getItems().map((value, index) => {
        return (
          <label {...methods.getItemLabelProps(index)} key={`${value}${index}`}>
            {value}
            <input {...methods.getItemInputProps(index)} />
          </label>
        )
      })}
      {methods.getError() && <p>This is an error!</p>}
    </label>
  )
}

test('should have string enum items', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio pointer="#/properties/stringTest" />
    </FormContext>
  )

  for (const item of mockRadioSchema.properties.stringTest.enum) {
    expect(getByText(item)).toBeDefined()
  }
})

test('should have all integers in interval', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio pointer="#/properties/integerTest" />
    </FormContext>
  )

  expect(getByText('0')).toBeDefined()
  expect(getByText('2')).toBeDefined()
  expect(getByText('4')).toBeDefined()
  expect(getByText('6')).toBeDefined()
})

test('should have all floats in interval, separated by step', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio pointer="#/properties/numberTest" />
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
    <FormContext schema={mockRadioSchema}>
      <MockRadio pointer="#/properties/booleanTest" />
    </FormContext>
  )

  expect(getByText('true')).toBeDefined()
  expect(getByText('false')).toBeDefined()
})

test('should raise error', async () => {
  const { getByText } = render(
    <FormContext
      schema={mockRadioSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockRadio pointer="#/properties/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})

test('should integer enum values', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio pointer="#/properties/integerEnumTest" />
    </FormContext>
  )

  expect(getByText('0')).toBeDefined()
  expect(getByText('1')).toBeDefined()
  expect(getByText('2')).toBeDefined()
  expect(getByText('3')).toBeDefined()
  expect(getByText('5')).toBeDefined()
  expect(getByText('7')).toBeDefined()
  expect(getByText('11')).toBeDefined()
  expect(getByText('13')).toBeDefined()
})
