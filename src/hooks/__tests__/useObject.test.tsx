import React, { FC } from 'react'
import { render, wait } from '@vtex/test-tools/react'

import { useObject } from '../useObject'
import { FormContext } from '../../components'
import {
  UseRawInputReturnType,
  InputReturnTypes,
  InputTypes,
  UseRadioReturnType,
  UseSelectReturnType,
  UISchemaType,
  UITypes,
} from '../types'
import mockObjectSchema, { toFixed } from '../__mocks__/mockSchema'

const mockUISchema: UISchemaType = {
  type: UITypes.default,
  properties: {
    numberTest: {
      type: UITypes.select,
    },
  },
}

const SpecializedObject: FC<{ baseObject: InputReturnTypes }> = props => {
  switch (props.baseObject.type) {
    case InputTypes.input: {
      const inputObject = props.baseObject as UseRawInputReturnType
      return (
        <>
          <label {...inputObject.getLabelProps()}>{inputObject.name}</label>
          <input {...inputObject.getInputProps()} />
        </>
      )
    }
    case InputTypes.radio: {
      const radioObject = props.baseObject as UseRadioReturnType
      return (
        <>
          <label {...radioObject.getLabelProps()}>{radioObject.name}</label>
          {radioObject.getItems().map((value, index) => {
            return (
              <label
                {...radioObject.getItemLabelProps(index)}
                key={`${value}${index}`}
              >
                {value}
                <input {...radioObject.getItemInputProps(index)} />
              </label>
            )
          })}
        </>
      )
    }
    case InputTypes.select: {
      const selectObject = props.baseObject as UseSelectReturnType
      return (
        <>
          <label {...selectObject.getLabelProps()}>{selectObject.name}</label>
          <select {...selectObject.getSelectProps()}>
            {selectObject.getItems().map((value, index) => {
              return (
                <option
                  {...selectObject.getItemOptionProps(index)}
                  key={`${value}${index}`}
                >
                  {value}
                </option>
              )
            })}
          </select>
        </>
      )
    }
  }
  return <></>
}

const MockObject: FC<{ path: string; UISchema?: UISchemaType }> = props => {
  const methods = useObject({ path: props.path, UISchema: props.UISchema })

  return (
    <>
      {methods.map(obj => (
        <div key={`${obj.type}${obj.path}`}>
          <SpecializedObject baseObject={obj} />
          {obj.getError() && <p>This is an error!</p>}
        </div>
      ))}
    </>
  )
}

test('should render all child properties of the schema', () => {
  const { getByText } = render(
    <FormContext schema={mockObjectSchema}>
      <MockObject path="#" />
    </FormContext>
  )

  for (const item of Object.keys(mockObjectSchema.properties)) {
    expect(getByText(item)).toBeDefined()
  }
})

test('should raise error', async () => {
  const { getByText } = render(
    // esling-disable-next-line no-console
    <FormContext
      schema={mockObjectSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockObject path="#/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() => expect(getByText('This is an error!')).toBeDefined())
})

test('ui schema should render number and input as select', async () => {
  const { getByText } = render(
    <FormContext schema={mockObjectSchema}>
      <MockObject path="#" UISchema={mockUISchema} />
    </FormContext>
  )

  for (
    let i = mockObjectSchema.properties.numberTest.minimum;
    i < mockObjectSchema.properties.numberTest.maximum;
    i += mockObjectSchema.properties.numberTest.multipleOf
  ) {
    expect(getByText(toFixed(i, 1))).toBeDefined()
  }
})
