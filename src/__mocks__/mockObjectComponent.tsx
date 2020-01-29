import React, { FC } from 'react'

import {
  useObject,
  UseRawInputReturnType,
  InputReturnTypes,
  InputTypes,
  UseRadioReturnType,
  UseSelectReturnType,
  UISchemaType,
  UseCheckboxReturnType,
} from '../hooks'

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
    case InputTypes.checkbox: {
      const checkboxObject = props.baseObject as UseCheckboxReturnType
      return (
        <>
          {checkboxObject.getItems().map((value, index) => {
            return (
              <label
                {...checkboxObject.getItemLabelProps(index)}
                key={`${value}${index}`}
              >
                {checkboxObject.isSingle ? checkboxObject.name : value}
                <input {...checkboxObject.getItemInputProps(index)} />
              </label>
            )
          })}
          {checkboxObject.getError() && <p>This is an error!</p>}
        </>
      )
    }
  }
  return <></>
}

export const MockObject: FC<{
  path: string
  UISchema?: UISchemaType
}> = props => {
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
