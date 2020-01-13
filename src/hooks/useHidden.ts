import {
  UseInputParameters,
  BasicInputReturnType,
  UseRawInputReturnType,
} from './types'
import { useGenericInput } from './useGenericInput'
import { getRawInputCustomFields } from './useRawInput'

export const getHiddenCustomFields = (
  baseObject: BasicInputReturnType
): UseRawInputReturnType => {
  baseObject.isRequired = false

  const returnObject = getRawInputCustomFields(baseObject, 'hidden')

  returnObject.getLabelProps = () => {
    return {}
  }

  return returnObject
}

export const useHidden: UseInputParameters = path => {
  return getHiddenCustomFields(useGenericInput(path))
}
