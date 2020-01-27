import React from 'react'
import { ValidationOptions } from 'react-hook-form'

import {
  UseTextAreaParameters,
  BasicInputReturnType,
  UseTextAreaReturnType,
  InputTypes,
} from './types'
import { getNumberValidator, getStringValidator } from './validators'
import { useGenericInput } from './useGenericInput'

const getInputId = (path: string): string => {
  return path + '-textarea-input'
}

const getLabelId = (path: string): string => {
  return path + '-textarea-label'
}

export const getTextAreaCustomFields = (
  baseObject: BasicInputReturnType
): UseTextAreaReturnType => {
  const currentObject = baseObject.getObject()

  let validator: ValidationOptions = {}

  const itemProps: React.ComponentProps<'textarea'> = {}
  if (currentObject.type === 'string') {
    validator = getStringValidator(currentObject, baseObject.isRequired)

    itemProps.minLength = currentObject.minLength
    itemProps.maxLength = currentObject.maxLength
  } else if (
    currentObject.type === 'number' ||
    currentObject.type === 'integer'
  ) {
    validator = getNumberValidator(currentObject, baseObject.isRequired)
  }

  return {
    ...baseObject,
    type: InputTypes.textArea,
    validator,
    getLabelProps: () => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getLabelId(baseObject.path)
      itemProps.htmlFor = getInputId(baseObject.path)

      return itemProps
    },
    getTextAreaProps: () => {
      itemProps.name = baseObject.path
      itemProps.ref = baseObject.formContext.register(validator)
      itemProps.required = baseObject.isRequired
      itemProps.id = getInputId(baseObject.path)

      return itemProps
    },
  }
}

export const useTextArea: UseTextAreaParameters = path => {
  return getTextAreaCustomFields(useGenericInput(path))
}
