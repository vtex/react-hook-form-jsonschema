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
  baseObject.isRequired = false

  const returnObject = getRawInputCustomFields(baseObject, 'hidden')

  returnObject.getLabelProps = noop

  return returnObject
}

export const useHidden: UseInputParameters = path => {
  return getHiddenCustomFields(useGenericInput(path))
}
