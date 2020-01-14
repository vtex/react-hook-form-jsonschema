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
} from '../types'

const toFixed = (value: number, precision: number): string => {
  const power = Math.pow(10, precision || 0)
  return String(Math.round(value * power) / power)
}

const mockObjectSchema = {
  type: 'object',
  required: ['errorTest'],
  properties: {
    stringTest: {
      type: 'string',
      name: 'test-useObjectString',
      enum: ['this', 'tests', 'the', 'useObject', 'hook'],
    },
    integerTest: {
      type: 'integer',
      name: 'test-useObjectInteger',
      minimum: 0,
      maximum: 10,
      multipleOf: 1,
    },
    numberTest: {
      type: 'number',
      name: 'test-useObjectNumber',
      minimum: 0,
      maximum: 10,
      multipleOf: 0.1,
    },
    booleanTest: {
      type: 'boolean',
      name: 'test-useObjectBoolean',
    },
    errorTest: {
      type: 'string',
      name: 'test-showError',
      enum: ['should', 'show', 'error', 'when', 'submitted'],
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

const MockObject: FC<{ path: string }> = props => {
  const methods = useObject(props.path)

  const objectForm = []
  for (const obj of methods) {
    objectForm.push(
      <div key={`${obj.type}${obj.path}`}>
        <SpecializedObject baseObject={obj} />
        {obj.getError() && <p>This is an error!</p>}
      </div>
    )
  }

  return <>{objectForm}</>
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
