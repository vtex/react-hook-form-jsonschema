import React from 'react'

import {
  UseTextAreaParameters,
  BasicInputReturnType,
  UseTextAreaReturnType,
  InputTypes,
} from './types'
import { useGenericInput } from './useGenericInput'

const getInputId = (path: string): string => {
  return path + '-textarea-input'
}

const getLabelId = (path: string): string => {
  return path + '-textarea-label'
}

export const getTextAreaCustomFields = (
  baseInput: BasicInputReturnType
): UseTextAreaReturnType => {
  const { register } = baseInput.formContext
  const { validator } = baseInput

  const currentObject = baseInput.getObject()

  const itemProps: React.ComponentProps<'textarea'> = {}
  if (currentObject.type === 'string') {
    itemProps.minLength = currentObject.minLength
    itemProps.maxLength = currentObject.maxLength
  }

  return {
    ...baseInput,
    type: InputTypes.textArea,
    getLabelProps: () => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getLabelId(baseInput.path)
      itemProps.htmlFor = getInputId(baseInput.path)

      return itemProps
    },
    getTextAreaProps: () => {
      itemProps.name = baseInput.path
      itemProps.ref = register(validator)
      itemProps.required = baseInput.isRequired
      itemProps.id = getInputId(baseInput.path)

      return itemProps
    },
  }
}

export const useTextArea: UseTextAreaParameters = path => {
  return getTextAreaCustomFields(useGenericInput(path))
}
