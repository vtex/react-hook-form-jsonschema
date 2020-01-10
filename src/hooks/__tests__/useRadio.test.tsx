import React, { FC } from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { useRadio } from '../useRadio'
import { FormContext } from '../../components'

const toFixed = (value: number, precision: number): string => {
  const power = Math.pow(10, precision || 0)
  return String(Math.round(value * power) / power)
}

const mockRadioSchema = {
  type: 'object',
  required: ['errorTest'],
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
    numberTest: {
      type: 'number',
      name: 'test-useRadioNumber',
      minimum: 0,
      maximum: 10,
      multipleOf: 0.1,
    },
    booleanTest: {
      type: 'boolean',
      name: 'test-useRadioBoolean',
    },
    errorTest: {
      type: 'string',
      name: 'test-showError',
      enum: ['should', 'show', 'error', 'when', 'submitted'],
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
      {methods.getError() && <p>This is an error!</p>}
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
    i += 1
  ) {
    expect(getByText(i.toString())).toBeDefined()
  }
})

test('should have all floats in interval, separated by step', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio path="#/numberTest" />
    </FormContext>
  )

  for (
    let i = mockRadioSchema.properties.numberTest.minimum;
    i < mockRadioSchema.properties.numberTest.maximum;
    i += mockRadioSchema.properties.numberTest.multipleOf
  ) {
    expect(getByText(toFixed(i, 1))).toBeDefined()
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

test('should raise error', async () => {
  const { getByText } = render(
    // esling-disable-next-line no-console
    <FormContext
      schema={mockRadioSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockRadio path="#/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})
