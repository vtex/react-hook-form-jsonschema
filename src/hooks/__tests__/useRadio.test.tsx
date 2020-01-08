import React, { FC } from 'react'
import { render } from '@vtex/test-tools/react'

import { useRadio } from '../useRadio'
import { FormContext } from '../../components'

const mockRadioSchema = {
  type: 'object',
  properties: {
    stringTest: {
      type: 'string',
      name: 'test-useRadioString',
      enum: ['this', 'tests', 'the', 'useRadio', 'hook'],
    },
    integerTest: {
      type: 'integer',
      name: 'test-useRadioInteger',
      minimum: 0,
      maximum: 10,
      multipleOf: 1,
    },
    booleanTest: {
      type: 'boolean',
      name: 'test-useRadioBoolean',
    },
  },
}

const MockRadio: FC<{ path: string }> = props => {
  const methods = useRadio(props.path)

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
    </label>
  )
}

test('should have string enum items', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio path="#/stringTest" />
    </FormContext>
  )

  for (const item of mockRadioSchema.properties.stringTest.enum) {
    expect(getByText(item)).toBeDefined()
  }
})

test('should have all integers in interval', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio path="#/integerTest" />
    </FormContext>
  )

  for (
    let i = mockRadioSchema.properties.integerTest.minimum;
    i < mockRadioSchema.properties.integerTest.maximum;
    i += mockRadioSchema.properties.integerTest.multipleOf
  ) {
    expect(getByText(i.toString())).toBeDefined()
  }
})

test('should have boolean true and false', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio path="#/booleanTest" />
    </FormContext>
  )

  expect(getByText('true')).toBeDefined()
  expect(getByText('false')).toBeDefined()
})
