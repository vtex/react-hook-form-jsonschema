import React from 'react'
import { ValidationOptions, FieldError } from 'react-hook-form'

import { UseRawFormParameters } from './types'
import { useFormContext } from '../components/types'
import {
  getError,
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

export const useRawInput: UseRawFormParameters = (
  path,
  inputType,
  currentObject,
  isRequired,
  currentName
) => {
  const { register, errors } = useFormContext()

  let validator: ValidationOptions = {}
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  const itemProps: React.ComponentProps<'input'> = { key: '' }
  if (currentObject.type === 'string') {
    validator = getStringValidator(currentObject, isRequired)

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

    validator = getNumberValidator(currentObject, isRequired)

    itemProps.min = minimum
    itemProps.max = maximum
    itemProps.step =
      step === 'any' ? 'any' : toFixed(step, decimalPlaces ? decimalPlaces : 0)
  }

  return {
    getLabelProps: () => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getLabelId(path, inputType)
      itemProps.htmlFor = getInputId(path, inputType)

      return itemProps
    },
    getInputProps: () => {
      itemProps.name = path
      itemProps.ref = register(validator)
      itemProps.type = inputType
      itemProps.required = isRequired
      itemProps.id = getInputId(path, inputType)

      return itemProps
    },
    getName: () => {
      return currentName
    },
    getError: () =>
      getError(
        errors[path] ? (errors[path] as FieldError) : undefined,
        currentObject,
        isRequired,
        minimum,
        maximum,
        step
      ),
  }
}
