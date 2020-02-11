import {
  UseObjectProperties,
  UseObjectReturnType,
  BasicInputReturnType,
  UISchemaType,
  UITypes,
} from './types'
import {
  useAnnotatedSchemaFromPath,
  concatFormPath,
  JSONSchemaPathInfo,
  JSONSchemaType,
} from '../JSONSchema'
import { getGenericInput } from './useGenericInput'
import { getInputCustomFields } from './useInput'
import { getRadioCustomFields } from './useRadio'
import { useFormContext, JSONFormContextValues } from '../components'
import { getSelectCustomFields } from './useSelect'
import { getHiddenCustomFields } from './useHidden'
import { getPasswordCustomFields } from './usePassword'
import { getTextAreaCustomFields } from './useTextArea'
import { getCheckboxCustomFields } from './useCheckbox'
import { getAnnotatedSchemaFromPath } from '../JSONSchema/logic'

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
  rootSchema: JSONSchemaType,
  UISchema: UISchemaType | undefined,
  formContext: JSONFormContextValues
) {
  return (allInputs: UseObjectReturnType, key: string) => {
    const newUISchema =
      UISchema && UISchema.properties ? UISchema.properties[key] : undefined

    const currentPath = concatFormPath(path, key)

    const currentPathInfo = getAnnotatedSchemaFromPath(
      currentPath,
      rootSchema,
      formContext
    )

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
  formContext: JSONFormContextValues,
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
      getChildProperties(path, formContext.schema, UISchema, formContext),
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
  const formContext = useFormContext()
  const childArray = getStructure(
    formContext,
    useAnnotatedSchemaFromPath(props.path, formContext.watch(props.path)),
    props.path,
    props.UISchema
  )

  return childArray
}
