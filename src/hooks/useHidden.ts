import { UseInputParameters } from './types'
import { useObjectFromPath } from '../JSONSchema'
import { useRawInput } from './useRawInput'

export const useHidden: UseInputParameters = path => {
  const [currentObject, , currentName] = useObjectFromPath(path)

  const inputType = 'hidden'

  const returnObject = useRawInput(
    path,
    inputType,
    currentObject,
    false,
    currentName
  )

  returnObject.getLabelProps = () => {
    return {}
  }

  return returnObject
}
