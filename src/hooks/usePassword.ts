import {
  UseInputParameters,
  BasicInputReturnType,
  UseRawInputReturnType,
} from './types'
import { getRawInputCustomFields } from './useRawInput'
import { useGenericInput } from './useGenericInput'

export const getPasswordCustomFields = (
  baseObject: BasicInputReturnType
): UseRawInputReturnType => {
  return getRawInputCustomFields(baseObject, 'password')
}

export const usePassword: UseInputParameters = pointer => {
  return getPasswordCustomFields(useGenericInput(pointer))
}
