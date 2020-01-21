import {
  UseInputParameters,
  BasicInputReturnType,
  UseRawInputReturnType,
} from './types'
import { useGenericInput } from './useGenericInput'
import { getRawInputCustomFields } from './useRawInput'

const noop = () => ({})

export const getHiddenCustomFields = (
  baseObject: BasicInputReturnType
): UseRawInputReturnType => {
  return {
    ...getRawInputCustomFields(baseObject, 'hidden'),
    isRequired: false,
    getLabelProps: noop,
  }
}

export const useHidden: UseInputParameters = path => {
  return getHiddenCustomFields(useGenericInput(path))
}
