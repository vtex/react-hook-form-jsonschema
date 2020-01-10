import React from 'react'
import { ValidationOptions, FieldError } from 'react-hook-form'

import { UseTextAreaParameters } from './types'
import { useFormContext } from '../components/types'
import { useObjectFromPath } from '../JSONSchema'
import {
  getError,
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
  getNumberValidator,
  getStringValidator,
} from './validators'

const getInputId = (path: string): string => {
  return path + '-textarea-input'
}

const getLabelId = (path: string): string => {
  return path + '-textarea-label'
}

export const useTextArea: UseTextAreaParameters = path => {
  const { register, errors } = useFormContext()
  const [currentObject, isRequired, currentName] = useObjectFromPath(path)

  let validator: ValidationOptions = {}
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'

  const itemProps: React.ComponentProps<'textarea'> = {}
  if (currentObject.type === 'string') {
    validator = getStringValidator(currentObject, isRequired)

    itemProps.minLength = currentObject.minLength
    itemProps.maxLength = currentObject.maxLength
  } else if (
    currentObject.type === 'number' ||
    currentObject.type === 'integer'
  ) {
    const stepAndDecimalPlaces = getNumberStep(currentObject)
    step = stepAndDecimalPlaces[0]

    minimum = getNumberMinimum(currentObject)
    maximum = getNumberMaximum(currentObject)

    validator = getNumberValidator(currentObject, isRequired)
  }

  return {
    getLabelProps: () => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getLabelId(path)
      itemProps.htmlFor = getInputId(path)

      return itemProps
    },
    getTextAreaProps: () => {
      itemProps.name = path
      itemProps.ref = register(validator)
      itemProps.required = isRequired
      itemProps.id = getInputId(path)

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
