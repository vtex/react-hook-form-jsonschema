import React, { FC } from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { useSelect } from '../useSelect'
import { FormContext } from '../../components'

const toFixed = (value: number, precision: number): string => {
  const power = Math.pow(10, precision || 0)
  return String(Math.round(value * power) / power)
}

const mockSelectSchema = {
  type: 'object',
  required: ['errorTest'],
  properties: {
    stringTest: {
      type: 'string',
      name: 'test-useSelectString',
      enum: ['this', 'tests', 'the', 'useSelect', 'hook'],
    },
    integerTest: {
      type: 'integer',
      name: 'test-useSelectInteger',
      minimum: 0,
      maximum: 10,
      multipleOf: 1,
    },
    numberTest: {
      type: 'number',
      name: 'test-useSelectNumber',
      minimum: 0,
      maximum: 10,
      multipleOf: 0.1,
    },
    booleanTest: {
      type: 'boolean',
      name: 'test-useSelectBoolean',
    },
    errorTest: {
      type: 'string',
      name: 'test-showError',
      enum: ['should', 'show', 'error', 'when', 'submitted'],
    },
  },
}

const MockSelect: FC<{ path: string }> = props => {
  const methods = useSelect(props.path)

  return (
    <>
      <label {...methods.getLabelProps()}>{methods.getName()}</label>
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
      <MockSelect path="#/stringTest" />
    </FormContext>
  )

  for (const item of mockSelectSchema.properties.stringTest.enum) {
    expect(getByText(item)).toBeDefined()
  }
})

test('should have all integers in interval', () => {
  const { getByText } = render(
    <FormContext schema={mockSelectSchema}>
      <MockSelect path="#/integerTest" />
    </FormContext>
  )

  for (
    let i = mockSelectSchema.properties.integerTest.minimum;
    i < mockSelectSchema.properties.integerTest.maximum;
    i += 1
  ) {
    expect(getByText(i.toString())).toBeDefined()
  }
})

test('should have all floats in interval, separated by step', () => {
  const { getByText } = render(
    <FormContext schema={mockSelectSchema}>
      <MockSelect path="#/numberTest" />
    </FormContext>
  )

  for (
    let i = mockSelectSchema.properties.numberTest.minimum;
    i < mockSelectSchema.properties.numberTest.maximum;
    i += mockSelectSchema.properties.numberTest.multipleOf
  ) {
    expect(getByText(toFixed(i, 1))).toBeDefined()
  }
})

test('should have boolean true and false', () => {
  const { getByText } = render(
    <FormContext schema={mockSelectSchema}>
      <MockSelect path="#/booleanTest" />
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
      <MockSelect path="#/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})
