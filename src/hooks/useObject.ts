import { FormContextValues } from 'react-hook-form'

import { UseObjectProperties, UseObjectReturnType } from './types'
import {
  JSONSchemaType,
  useObjectFromPath,
  concatFormPath,
} from '../JSONSchema'
import { getGenericInput } from './useGenericInput'
import { getInputCustomFields } from './useInput'
import { getRadioCustomFields } from './useRadio'
import { useFormContext } from '../components/types'

const useObjectStructure = (path: string): UseObjectReturnType => {
  function getStructure(
    formContext: FormContextValues,
    pathInfo: [JSONSchemaType, boolean, string],
    path: string
  ): UseObjectReturnType {
    const inputs: UseObjectReturnType = []
    const currentObject = pathInfo[0]

    const genericInput = getGenericInput(formContext, pathInfo, path)
    switch (currentObject.type) {
      case 'string':
        return [getInputCustomFields(genericInput)]
      case 'integer':
      case 'number':
        return [getInputCustomFields(genericInput)]
      case 'object':
        {
          const objKeys = Object.keys(currentObject.properties)
          const requiredFields: Array<string> | undefined =
            currentObject.required
          for (const key of objKeys) {
            const isRequired = requiredFields
              ? requiredFields.indexOf(key) !== -1
              : false
            const currentPathInfo: [JSONSchemaType, boolean, string] = [
              currentObject[key],
              isRequired,
              key,
            ]
            const currentPath = concatFormPath(path, key)
            inputs.concat(
              getStructure(formContext, currentPathInfo, currentPath)
            )
          }
        }
        break
    }

    return inputs
  }

  const childArray = getStructure(
    useFormContext(),
    useObjectFromPath(path),
    path
  )

  return childArray
}

export const useObject: UseObjectProperties = path => {
  return useObjectStructure(path)
}
