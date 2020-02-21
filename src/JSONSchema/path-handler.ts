import { JSONSchemaType, JSONSubSchemaInfo } from './types'
import {
  getObjectFromForm,
  concatFormPointer,
  getAnnotatedSchemaFromPointer,
  getSplitPointer,
} from './logic'
import { useFormContext } from '../components'

const useAnnotatedSchemaFromPointer = (
  path: string,
  data: JSONSchemaType
): JSONSubSchemaInfo => {
  return getAnnotatedSchemaFromPointer(path, data, useFormContext())
}

const useObjectFromForm = (data: JSONSchemaType): JSONSchemaType => {
  return getObjectFromForm(useFormContext().schema, data)
}

const getDataFromPointer = (
  pointer: string,
  data: JSONSchemaType
): undefined | string => {
  const splitPointer = getSplitPointer(pointer)

  let insideProperties = false

  return splitPointer
    .reduce(
      (currentContext, node: string) => {
        if (node === 'properties' && !insideProperties) {
          insideProperties = true
          return { ...currentContext, insideProperties: true }
        }
        insideProperties = false

        return {
          currentData: currentContext.currentData
            ? currentContext.currentData[node]
            : undefined,
          insideProperties: true,
        }
      },
      { currentData: data, insideProperties: false }
    )
    .currentData?.toString()
}

export {
  useObjectFromForm,
  concatFormPointer,
  useAnnotatedSchemaFromPointer,
  getDataFromPointer,
}
