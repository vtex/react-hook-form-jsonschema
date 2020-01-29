import { FormContextValues } from 'react-hook-form'

import {
  UseObjectProperties,
  UseObjectReturnType,
  BasicInputReturnType,
  UISchemaType,
  UITypes,
} from './types'
import {
  useObjectFromPath,
  concatFormPath,
  JSONSchemaPathInfo,
  JSONSchemaType,
} from '../JSONSchema'
import { getGenericInput } from './useGenericInput'
import { getInputCustomFields } from './useInput'
import { getRadioCustomFields } from './useRadio'
import { useFormContext } from '../components'
import { getSelectCustomFields } from './useSelect'
import { getHiddenCustomFields } from './useHidden'
import { getPasswordCustomFields } from './usePassword'
import { getTextAreaCustomFields } from './useTextArea'
import { getCheckboxCustomFields } from './useCheckbox'

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
    case 'array':
    case 'boolean':
      inputs.push(getCheckboxCustomFields(genericInput))
      break
  }
  return inputs
}

// Outside of this function
function getChildProperties(
  path: string,
  schema: JSONSchemaType,
  UISchema: UISchemaType | undefined,
  formContext: FormContextValues
) {
  const requiredFields = schema.required

  return (allInputs: UseObjectReturnType, key: string) => {
    const isRequired = requiredFields
      ? requiredFields.indexOf(key) !== -1
      : false

    const newUISchema =
      UISchema && UISchema.properties ? UISchema.properties[key] : undefined

    const currentPath = concatFormPath(path, key)

    const currentPathInfo: JSONSchemaPathInfo = {
      JSONSchema: schema.properties[key],
      isRequired: isRequired,
      objectName: key,
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const newInput = getStructure(
      formContext,
      currentPathInfo,
      currentPath,
      newUISchema
    )

    return allInputs.concat(newInput)
  }
}

function getStructure(
  formContext: FormContextValues,
  pathInfo: JSONSchemaPathInfo,
  path: string,
  UISchema: UISchemaType | undefined
): UseObjectReturnType {
  let inputs: UseObjectReturnType = []
  const { JSONSchema } = pathInfo

  const genericInput = getGenericInput(formContext, pathInfo, path)

  if (JSONSchema.type === 'object') {
    const objKeys = Object.keys(JSONSchema.properties)
    const childInputs = objKeys.reduce(
      getChildProperties(path, JSONSchema, UISchema, formContext),
      []
    )
    return childInputs
  }

  if (!UISchema) {
    return inputs.concat(getFromGeneric(genericInput))
  }

  switch (UISchema.type) {
    case UITypes.default:
      inputs = inputs.concat(getFromGeneric(genericInput))
      break
    case UITypes.checkbox:
      inputs.push(getCheckboxCustomFields(genericInput))
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
