import {
  UseInputParameters,
  BasicInputReturnType,
  UseRawInputReturnType,
} from './types'
import { getRawInputCustomFields } from './useRawInput'
import { useGenericInput } from './useGenericInput'

export const getInputCustomFields = (
  baseObject: BasicInputReturnType
): UseRawInputReturnType => {
  const currentObject = baseObject.getObject()

  let inputType = 'text'
  if (currentObject.type === 'string') {
    switch (currentObject.format) {
      case 'date-time':
        inputType = 'datetime-local'
        break
      case 'email':
        inputType = 'email'
        break
      case 'hostname':
        inputType = 'url'
        break
      case 'uri':
        inputType = 'url'
        break
    }
  } else if (
    currentObject.type === 'integer' ||
    currentObject.type === 'number'
  ) {
    inputType = 'number'
  }

  return getRawInputCustomFields(baseObject, inputType)
}

export const useInput: UseInputParameters = pointer => {
  return getInputCustomFields(useGenericInput(pointer))
}
