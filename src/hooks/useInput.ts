import { UseInputParameters } from './types'
import { useObjectFromPath } from '../JSONSchema'
import { useRawInput } from './useRawInput'

export const useInput: UseInputParameters = path => {
  const [currentObject, isRequired, currentName] = useObjectFromPath(path)

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

  return useRawInput(path, inputType, currentObject, isRequired, currentName)
}
