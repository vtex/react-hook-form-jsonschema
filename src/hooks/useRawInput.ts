import React from 'react'

import {
  UseRawInputParameters,
  BasicInputReturnType,
  UseRawInputReturnType,
  InputTypes,
} from './types'
import {
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
  toFixed,
} from './validators'

const getInputId = (path: string, inputType: string): string => {
  return path + '-' + inputType + '-input'
}

const getLabelId = (path: string, inputType: string): string => {
  return path + '-' + inputType + '-label'
}

export const getRawInputCustomFields = (
  baseInput: BasicInputReturnType,
  inputType: string
): UseRawInputReturnType => {
  const { register } = baseInput.formContext
  const { validator } = baseInput

  const currentObject = baseInput.getObject()

  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  const itemProps: React.ComponentProps<'input'> = { key: '' }
  if (currentObject.type === 'string') {
    itemProps.pattern = currentObject.pattern
    itemProps.minLength = currentObject.minLength
    itemProps.maxLength = currentObject.maxLength
  } else if (
    currentObject.type === 'number' ||
    currentObject.type === 'integer'
  ) {
    const stepAndDecimalPlaces = getNumberStep(currentObject)
    step = stepAndDecimalPlaces[0]
    decimalPlaces = stepAndDecimalPlaces[1]

    minimum = getNumberMinimum(currentObject)
    maximum = getNumberMaximum(currentObject)

    itemProps.min = `${minimum}`
    itemProps.max = `${maximum}`
    itemProps.step =
      step === 'any' ? 'any' : toFixed(step, decimalPlaces ? decimalPlaces : 0)
  }

  return {
    ...baseInput,
    type: InputTypes.input,
    getLabelProps: () => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getLabelId(baseInput.path, inputType)
      itemProps.htmlFor = getInputId(baseInput.path, inputType)

      return itemProps
    },
    getInputProps: () => {
      itemProps.name = baseInput.path
      itemProps.ref = register(validator)
      itemProps.type = inputType
      itemProps.required = baseInput.isRequired
      itemProps.id = getInputId(baseInput.path, inputType)

      return itemProps
    },
  }
}

export const useRawInput: UseRawInputParameters = (baseObject, inputType) => {
  return getRawInputCustomFields(baseObject, inputType)
}
