import { fireEvent, render } from '@vtex/test-tools/react'
import React from 'react'
import { Controller } from 'react-hook-form'

import { useObject } from '../../hooks/useObject'
import mockSchema from '../__mocks__/mockSchema'
import { FormContext } from '../FormContext'

const ObjectRenderer = (props: { pointer: string }) => {
  const fields = useObject({ pointer: props.pointer })

  return (
    <>
      {fields.map(field => {
        const fieldJsonSchema = field.getObject()

        return (
          <Controller
            as={<input aria-label={fieldJsonSchema.title} name={field.name} />}
            control={field.formContext.control}
            defaultValue=""
            key={field.pointer}
            name={field.pointer}
          />
        )
      })}
    </>
  )
}

test('should call onChange when something changes', () => {
  const changeHandlerMock = jest.fn()

  const { getByLabelText } = render(
    <FormContext onChange={changeHandlerMock} schema={mockSchema}>
      <ObjectRenderer pointer="#" />
    </FormContext>
  )

  expect(changeHandlerMock).toHaveBeenCalledTimes(0)

  let changeValue

  Object.entries(mockSchema.properties).forEach(
    ([fieldName, fieldProperties], index) => {
      const fieldNumber = index + 1

      const inputElement = getByLabelText(fieldProperties.title)

      const fieldNewValue = `new value for field ${fieldNumber}`

      fireEvent.change(inputElement, {
        target: { value: fieldNewValue },
      })

      expect(changeHandlerMock).toHaveBeenCalledTimes(fieldNumber)

      changeValue = { ...changeValue, [fieldName]: fieldNewValue }

      expect(changeHandlerMock).toHaveBeenLastCalledWith(changeValue)
    }
  )
})
