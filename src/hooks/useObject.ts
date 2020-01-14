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

function getStructure(
  formContext: FormContextValues,
  pathInfo: [JSONSchemaType, boolean, string],
  path: string
): UseObjectReturnType {
  let inputs: UseObjectReturnType = []
  const currentObject = pathInfo[0]

  const genericInput = getGenericInput(formContext, pathInfo, path)
  switch (currentObject.type) {
    case 'string':
      inputs.push(getInputCustomFields(genericInput))
      break
    case 'integer':
    case 'number':
      inputs.push(getInputCustomFields(genericInput))
      break
    case 'boolean':
      inputs.push(getRadioCustomFields(genericInput))
      break
    case 'object':
      {
        const objKeys = Object.keys(currentObject.properties)
        const requiredFields: Array<string> | undefined = currentObject.required
        for (const key of objKeys) {
          const isRequired = requiredFields
            ? requiredFields.indexOf(key) !== -1
            : false
          const currentPathInfo: [JSONSchemaType, boolean, string] = [
            currentObject.properties[key],
            isRequired,
            key,
          ]
          const currentPath = concatFormPath(path, key)
          inputs = inputs.concat(
            getStructure(formContext, currentPathInfo, currentPath)
          )
        }
      }
      break
  }

  return inputs
}

export const useObject: UseObjectProperties = path => {
  const childArray = getStructure(
    useFormContext(),
    useObjectFromPath(path),
    path
  )

  return childArray
}
