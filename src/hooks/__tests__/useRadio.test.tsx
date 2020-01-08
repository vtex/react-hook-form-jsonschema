import React, { FC } from 'react'
import { render } from '@vtex/test-tools/react'

import { useRadio } from '../useRadio'
import { FormContext } from '../../components'

const mockRadioSchema = {
  type: 'string',
  name: 'test-useRadio',
  enum: ['this', 'tests', 'the', 'useRadio', 'hook'],
}

const MockRadio: FC<{}> = () => {
  const methods = useRadio('#/')

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

test('should have enum items', () => {
  const { getByText } = render(
    <FormContext schema={mockRadioSchema}>
      <MockRadio />
    </FormContext>
  )

  for (const item of mockRadioSchema.enum) {
    expect(getByText(item)).toBeDefined()
  }
})
