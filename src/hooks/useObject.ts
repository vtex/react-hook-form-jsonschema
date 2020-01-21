import { FormContextValues } from 'react-hook-form'

import {
  UseObjectProperties,
  UseObjectReturnType,
  BasicInputReturnType,
  UISchemaType,
  UITypes,
} from './types'
import {
  JSONSchemaType,
  useObjectFromPath,
  concatFormPath,
  JSONSchemaPathInfo,
} from '../JSONSchema'
import { getGenericInput } from './useGenericInput'
import { getInputCustomFields } from './useInput'
import { getRadioCustomFields } from './useRadio'
import { useFormContext } from '../components'
import { getSelectCustomFields } from './useSelect'
import { getHiddenCustomFields } from './useHidden'
import { getPasswordCustomFields } from './usePassword'
import { getTextAreaCustomFields } from './useTextArea'

function getFromGeneric(
  genericInput: BasicInputReturnType
): UseObjectReturnType {
  const currentObject = genericInput.getObject()
  const inputs: UseObjectReturnType = []

  switch (currentObject.type) {
    case 'string':
      if (currentObject.enum) {
        inputs.push(getSelectCustomFields(genericInput))
      } else {
        inputs.push(getInputCustomFields(genericInput))
      }
      break
    case 'integer':
    case 'number':
      inputs.push(getInputCustomFields(genericInput))
      break
    case 'boolean':
      inputs.push(getRadioCustomFields(genericInput))
      break
  }
  return inputs
}

function getStructure(
  formContext: FormContextValues,
  pathInfo: JSONSchemaPathInfo,
  path: string,
  UISchema: UISchemaType | undefined
): UseObjectReturnType {
  let inputs: UseObjectReturnType = []
  const currentObject = pathInfo[0]

  const genericInput = getGenericInput(formContext, pathInfo, path)

  if (currentObject.type === 'object') {
    const objKeys = Object.keys(currentObject.properties)
    const requiredFields: Array<string> | undefined = currentObject.required
    for (const key of objKeys) {
      const isRequired = requiredFields
        ? requiredFields.indexOf(key) !== -1
        : false

      const currentPathInfo: JSONSchemaPathInfo = [
        currentObject.properties[key],
        isRequired,
        key,
      ]

      const currentPath = concatFormPath(path, key)

      let newUISchema = undefined
      if (UISchema && UISchema.properties) {
        newUISchema = UISchema.properties[key]
      }

      inputs = inputs.concat(
        getStructure(formContext, currentPathInfo, currentPath, newUISchema)
      )
    }
    return inputs
  }

  if (!UISchema) {
    return inputs.concat(getFromGeneric(genericInput))
  }

  switch (UISchema.type) {
    case UITypes.default:
      inputs = inputs.concat(getFromGeneric(genericInput))
      break
    case UITypes.hidden:
      inputs.push(getHiddenCustomFields(genericInput))
      break
    case UITypes.input:
      inputs.push(getInputCustomFields(genericInput))
      break
    case UITypes.password:
      inputs.push(getPasswordCustomFields(genericInput))
      break
    case UITypes.radio:
      inputs.push(getRadioCustomFields(genericInput))
      break
    case UITypes.select:
      inputs.push(getSelectCustomFields(genericInput))
      break
    case UITypes.textArea:
      inputs.push(getTextAreaCustomFields(genericInput))
      break
  }

  return inputs
}

export const useObject: UseObjectProperties = props => {
  const childArray = getStructure(
    useFormContext(),
    useObjectFromPath(props.path),
    props.path,
    props.UISchema
  )

  return childArray
}
