import { JSONSchemaType, JSONSchemaPathInfo } from '../types'
import { JSONFormContextValues } from '../../components'
import { getSplitPath, concatFormPath, JSONSchemaRootPath } from './pathUtils'

const parsers: Record<string, (data: string) => number | boolean> = {
  integer: (data: string): number => parseInt(data),
  number: (data: string): number => parseFloat(data),
  boolean: (data: string): boolean => data === 'true',
}

export const getObjectFromForm = (
  originalSchema: JSONSchemaType,
  data: JSONSchemaType
): JSONSchemaType => {
  return Object.keys(data)
    .sort()
    .reduce((objectFromData: JSONSchemaType, key: string) => {
      const splitPath = getSplitPath(key)
      if (!splitPath || !data[key]) {
        return objectFromData
      }

      let currentPath = objectFromData
      let currentOriginalPath = originalSchema

      for (let node = 0; node < splitPath.length; node++) {
        if (currentOriginalPath == undefined) {
          break
        }

        if (currentOriginalPath.type && currentOriginalPath.type === 'object') {
          currentOriginalPath = currentOriginalPath.properties
          currentOriginalPath = currentOriginalPath[splitPath[node]]
        }

        if (node === splitPath.length - 1) {
          if (!currentOriginalPath) {
            break
          }

          currentPath[splitPath[node]] =
            currentOriginalPath.type && parsers[currentOriginalPath.type]
              ? parsers[currentOriginalPath.type](data[key])
              : data[key] ?? {}
        } else if (currentPath[splitPath[node]] == undefined) {
          currentPath[splitPath[node]] = {}
        }

        currentPath = currentPath[splitPath[node]]
      }
      return objectFromData
    }, {})
}

interface ReducerPathInfo {
  JSONSchema: JSONSchemaType
  currentData: JSONSchemaType
  invalidPointer: boolean
  isRequired: boolean
  fatherExists: boolean
  fatherIsRequired: boolean
  pointer: string
  objectName: string
}

export const getAnnotatedSchemaFromPath = (
  path: string,
  data: JSONSchemaType,
  formContext: JSONFormContextValues
): JSONSchemaPathInfo => {
  const { schema } = formContext

  const info = getSplitPath(path).reduce(
    (currentInfo: ReducerPathInfo, node: string) => {
      const { JSONSchema, currentData } = currentInfo

      if (
        !(JSONSchema && JSONSchema.type === 'object' && JSONSchema.properties)
      ) {
        return {
          ...currentInfo,
          JSONSchema: undefined,
          invalidPointer: true,
        }
      }

      const fatherExists = currentData ? true : false
      const newCurrentData = currentData ? currentData[node] : currentData

      const fatherIsRequired = currentInfo.isRequired
      const isRequired =
        JSONSchema.required &&
        (JSONSchema.required as string[]).indexOf(node) > -1

      return {
        JSONSchema: JSONSchema.properties[node],
        currentData: newCurrentData,
        fatherExists,
        fatherIsRequired,
        invalidPointer: false,
        isRequired,
        objectName: node,
        pointer: concatFormPath(
          concatFormPath(currentInfo.pointer, 'properties'),
          node
        ),
      }
    },
    {
      JSONSchema: schema,
      currentData: data,
      fatherExists: true,
      fatherIsRequired: true,
      invalidPointer: false,
      isRequired: true,
      objectName: '',
      pointer: JSONSchemaRootPath,
    }
  )

  return {
    JSONSchema: info.JSONSchema,
    invalidPointer: info.invalidPointer,
    isRequired:
      (info.fatherIsRequired && info.isRequired) ||
      (!info.fatherIsRequired && info.isRequired && info.fatherExists),
    objectName: info.objectName,
    path,
    pointer: info.pointer,
  }
}
