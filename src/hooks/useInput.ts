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

  let inputType: string
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

    default:
      inputType = 'text'
  }

  return getRawInputCustomFields(baseObject, inputType)
}

export const useInput: UseInputParameters = path => {
  return getInputCustomFields(useGenericInput(path))
}
