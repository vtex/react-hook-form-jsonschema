import { JSONSchemaType, JSONSchemaPathInfo } from './types'
import {
  getObjectFromForm,
  concatFormPath,
  getAnnotatedSchemaFromPath,
  getSplitPath,
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

const getDataFromPath = (
  path: string,
  data: JSONSchemaType
): undefined | string => {
  const splitPath = getSplitPath(path)
  let currentData = data

  for (const node of splitPath) {
    if (currentData) {
      currentData = currentData[node]
    }
  }

  return currentData?.toString()
}

export {
  useObjectFromForm,
  concatFormPath,
  useAnnotatedSchemaFromPath,
  getDataFromPath,
}
