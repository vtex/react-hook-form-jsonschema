import { UseInputParameters } from './types'
import { useObjectFromPath } from '../JSONSchema'
import { useRawInput } from './useRawInput'

export const useHidden: UseInputParameters = path => {
  const [currentObject, isRequired, currentName] = useObjectFromPath(path)

  const inputType = 'password'

  return useRawInput(path, inputType, currentObject, isRequired, currentName)
}
