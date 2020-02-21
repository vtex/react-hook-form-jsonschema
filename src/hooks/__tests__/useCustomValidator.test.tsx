import React, { FC } from 'react'
import { render, wait, fireEvent } from '@vtex/test-tools/react'

import { useRawInput } from '../useRawInput'
import { FormContext } from '../../components'
import { useGenericInput } from '../useGenericInput'
import mockRawFormSchema from '../__mocks__/mockTextSchema'

const MockRawForm: FC<{ pointer: string }> = props => {
  const methods = useRawInput(useGenericInput(props.pointer), 'text')

  const error = methods.getError()
  return (
    <label {...methods.getLabelProps()}>
      {methods.name}
      <input {...methods.getInputProps()} />
      {error && <p>{error.message}</p>}
    </label>
  )
}

test('should use custom validator', async () => {
  const { getByText, container, getByLabelText, queryByText } = render(
    <FormContext
      schema={mockRawFormSchema}
      onSubmit={() => {
        return
      }}
      customValidators={{
        validateNameHelena: value => {
          return value === 'Helena' ? true : '__is_not_helena_error__'
        },
      }}
    >
      <MockRawForm pointer="#/properties/stringTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  expect(container.querySelector('input')).toBeDefined()
  expect(container.querySelector('label')).toBeDefined()
  expect(getByText('stringTest')).toBeDefined()

  const stringField = getByLabelText('stringTest')
  getByText('Submit').click()
  fireEvent.change(stringField, {
    target: { value: 'Another name' },
  })

  await wait(() => {
    expect(getByText('__is_not_helena_error__')).toBeDefined()
  })

  getByText('Submit').click()
  fireEvent.change(stringField, {
    target: { value: 'Helena' },
  })

  await wait(() => {
    expect(queryByText('__is_not_helena_error__')).toBeNull()
  })
})
