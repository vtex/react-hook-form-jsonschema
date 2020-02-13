import { JSONSchemaType, JSONSchemaPathInfo } from './types'
import {
  getObjectFromForm,
  concatFormPath,
  getAnnotatedSchemaFromPath,
} from './logic'
import { useFormContext } from '../components'

const useAnnotatedSchemaFromPath = (
  path: string,
  data: JSONSchemaType
): JSONSchemaPathInfo => {
  return getAnnotatedSchemaFromPath(path, data, useFormContext())
}

const useObjectFromForm = (data: JSONSchemaType): JSONSchemaType => {
  return getObjectFromForm(useFormContext().schema, data)
}

export { useObjectFromForm, concatFormPath, useAnnotatedSchemaFromPath }
