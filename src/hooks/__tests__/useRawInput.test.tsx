import React, { FC } from 'react'
import { render, wait, fireEvent } from '@vtex/test-tools/react'

import { useRawInput } from '../useRawInput'
import { FormContext } from '../../components'
import { useGenericInput } from '../useGenericInput'
import mockRawFormSchema from '../__mocks__/mockTextSchema'

const MockRawForm: FC<{ path: string }> = props => {
  const methods = useRawInput(useGenericInput(props.path), 'text')

  return (
    <label {...methods.getLabelProps()}>
      {methods.name}
      <input {...methods.getInputProps()} />
      {methods.getError() && <p>This is an error!</p>}
    </label>
  )
}

test('should have string enum items', () => {
  const { getByText, container } = render(
    <FormContext
      schema={mockRawFormSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockRawForm path="$/stringTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  expect(container.querySelector('input')).toBeDefined()
  expect(container.querySelector('label')).toBeDefined()
  expect(getByText('stringTest')).toBeDefined()
})

test('should have all integers in interval', () => {
  const { getByText, container } = render(
    <FormContext
      schema={mockRawFormSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockRawForm path="$/integerTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  expect(container.querySelector('input')).toBeDefined()
  expect(container.querySelector('label')).toBeDefined()
  expect(getByText('integerTest')).toBeDefined()
})

test('should have all floats in interval, separated by step', () => {
  const { getByText, container } = render(
    <FormContext schema={mockRawFormSchema}>
      <MockRawForm path="$/numberTest" />
    </FormContext>
  )

  expect(container.querySelector('input')).toBeDefined()
  expect(container.querySelector('label')).toBeDefined()
  expect(getByText('numberTest')).toBeDefined()
})

test('should raise error', async () => {
  const { getByLabelText, getByText } = render(
    <FormContext
      schema={mockRawFormSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockRawForm path="$/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()
  fireEvent.change(getByLabelText('errorTest'), { target: { value: 'a' } })

  await wait(() => {
    expect(getByText('This is an error!')).toBeDefined()
  })
})
