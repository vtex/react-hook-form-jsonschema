import React from 'react'
import { ValidationOptions } from 'react-hook-form'

import {
  UseRawInputParameters,
  BasicInputReturnType,
  UseRawInputReturnType,
} from './types'
import {
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
  getNumberValidator,
  getStringValidator,
  toFixed,
} from './validators'

const getInputId = (path: string, inputType: string): string => {
  return path + '-' + inputType + '-input'
}

const getLabelId = (path: string, inputType: string): string => {
  return path + '-' + inputType + '-label'
}

export const getRawInputCustomFields = (
  baseFields: BasicInputReturnType,
  inputType: string
): UseRawInputReturnType => {
  const { register } = baseFields.formContext
  const currentObject = baseFields.getObject()

  let validator: ValidationOptions = {}
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  const itemProps: React.ComponentProps<'input'> = { key: '' }
  if (currentObject.type === 'string') {
    validator = getStringValidator(currentObject, baseFields.isRequired)

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

    validator = getNumberValidator(currentObject, baseFields.isRequired)

    itemProps.min = minimum
    itemProps.max = maximum
    itemProps.step =
      step === 'any' ? 'any' : toFixed(step, decimalPlaces ? decimalPlaces : 0)
  }

  return {
    ...baseFields,
    getLabelProps: () => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getLabelId(baseFields.path, inputType)
      itemProps.htmlFor = getInputId(baseFields.path, inputType)

      return itemProps
    },
    getInputProps: () => {
      itemProps.name = baseFields.path
      itemProps.ref = register(validator)
      itemProps.type = inputType
      itemProps.required = baseFields.isRequired
      itemProps.id = getInputId(baseFields.path, inputType)

      return itemProps
    },
  }
}

export const useRawInput: UseRawInputParameters = (baseObject, inputType) => {
  return getRawInputCustomFields(baseObject, inputType)
}
