import React, { FC } from 'react'
import { render, wait, fireEvent } from '@vtex/test-tools/react'

import { useTextArea } from '../useTextArea'
import { FormContext } from '../../components'
import mockTextAreaSchema from '../__mocks__/mockTextSchema'

const MockTextArea: FC<{ path: string }> = props => {
  const methods = useTextArea(props.path)

  return (
    <>
      <label {...methods.getLabelProps()}>{methods.name}</label>
      <textarea {...methods.getTextAreaProps()} />
      {methods.getError() && <p>This is an error!</p>}
    </>
  )
}

test('should have string enum items', () => {
  const { getByText, container } = render(
    <FormContext
      schema={mockTextAreaSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockTextArea path="#/properties/stringTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  expect(container.querySelector('input')).toBeDefined()
  expect(container.querySelector('textarea')).toBeDefined()
  expect(getByText('stringTest')).toBeDefined()
})

test('should have all integers in interval', () => {
  const { getByText, container } = render(
    <FormContext
      schema={mockTextAreaSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockTextArea path="#/properties/integerTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  expect(container.querySelector('input')).toBeDefined()
  expect(container.querySelector('label')).toBeDefined()
  expect(getByText('integerTest')).toBeDefined()
})

test('should have all floats in interval, separated by step', () => {
  const { getByText, container } = render(
    <FormContext schema={mockTextAreaSchema}>
      <MockTextArea path="#/properties/numberTest" />
    </FormContext>
  )

  expect(container.querySelector('input')).toBeDefined()
  expect(container.querySelector('label')).toBeDefined()
  expect(getByText('numberTest')).toBeDefined()
})

test('should raise error', async () => {
  const { getByLabelText, getByText } = render(
    <FormContext
      schema={mockTextAreaSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockTextArea path="#/properties/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()
  fireEvent.change(getByLabelText('errorTest'), { target: { value: 'a' } })

  await wait(() => {
    expect(getByText('This is an error!')).toBeDefined()
  })
})
