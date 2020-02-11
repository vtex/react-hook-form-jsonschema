import React, { FC } from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { useCheckbox } from '../useCheckbox'
import { FormContext } from '../../components'
import mockCheckboxSchema from '../__mocks__/mockSchema'

const MockCheckbox: FC<{ path: string }> = props => {
  const methods = useCheckbox(props.path)

  return (
    <>
      {methods.getItems().map((value, index) => {
        return (
          <label {...methods.getItemLabelProps(index)} key={`${value}${index}`}>
            {methods.isSingle ? methods.getObject().title : value}
            <input
              {...methods.getItemInputProps(index)}
              ref={methods.formContext.register({})}
            />
          </label>
        )
      })}
      {methods.getError() && <p>This is an error!</p>}
    </>
  )
}

test('should have boolean true and false', done => {
  const { getByText } = render(
    <FormContext
      schema={mockCheckboxSchema}
      onSubmit={data => {
        expect(data.booleanTest).toBe(true)
        done()
      }}
    >
      <MockCheckbox path="#/booleanTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )
  expect(getByText('test-useSelectBoolean')).toBeDefined()

  getByText('test-useSelectBoolean').click()
  getByText('Submit').click()
})

test('should raise error', async () => {
  const { getByText } = render(
    <FormContext
      schema={mockCheckboxSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockCheckbox path="#/arrayErrorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})
