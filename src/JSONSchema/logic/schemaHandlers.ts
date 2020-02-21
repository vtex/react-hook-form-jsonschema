import { JSONSchemaType, JSONSubSchemaInfo } from '../types'
import { JSONFormContextValues } from '../../components'
import {
  concatFormPointer,
  JSONSchemaRootPointer,
  getSplitPointer,
} from './pathUtils'

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
      const splitPointer = getSplitPointer(key)
      if (!splitPointer || !data[key]) {
        return objectFromData
      }

      splitPointer.reduce(
        (currentContext, node: string, index: number, src: string[]) => {
          currentContext.currentSubSchema = currentContext.currentSubSchema
            ? currentContext.currentSubSchema[node]
            : undefined

          if (node === 'properties' && !currentContext.insideProperties) {
            return { ...currentContext, insideProperties: true }
          }

          if (index === src.length - 1 && currentContext.currentSubSchema) {
            currentContext.currentJSON[node] =
              currentContext.currentSubSchema.type &&
              parsers[currentContext.currentSubSchema.type]
                ? parsers[currentContext.currentSubSchema.type](data[key])
                : currentContext.targetData ?? {}
          } else if (
            !currentContext.currentJSON[node] &&
            currentContext.currentSubSchema
          ) {
            currentContext.currentJSON[node] = {}
          }

          currentContext.currentJSON = currentContext.currentJSON[node]

          return { ...currentContext, insideProperties: false }
        },
        {
          currentJSON: objectFromData,
          currentSubSchema: originalSchema,
          insideProperties: false,
          targetData: data[key],
        }
      )
      return objectFromData
    }, {})
}

interface ReducerSubSchemaInfo {
  JSONSchema: JSONSchemaType
  currentData: JSONSchemaType
  invalidPointer: boolean
  isRequired: boolean
  fatherExists: boolean
  fatherIsRequired: boolean
  pointer: string
  objectName: string
  insideProperties: boolean
  currentRequiredField: string[]
}

export const getAnnotatedSchemaFromPointer = (
  pointer: string,
  data: JSONSchemaType,
  formContext: JSONFormContextValues
): JSONSubSchemaInfo => {
  const { schema } = formContext

  const info = getSplitPointer(pointer).reduce(
    (currentInfo: ReducerSubSchemaInfo, node: string) => {
      const { JSONSchema, currentData } = currentInfo

      if (
        !(JSONSchema && JSONSchema.type === 'object') &&
        !currentInfo.insideProperties
      ) {
        return {
          ...currentInfo,
          JSONSchema: undefined,
          invalidPointer: true,
        }
      } else if (node === 'properties' && !currentInfo.insideProperties) {
        const fatherIsRequired = currentInfo.isRequired

        return {
          ...currentInfo,
          JSONSchema: JSONSchema.properties,
          fatherIsRequired,
          pointer: concatFormPointer(currentInfo.pointer, node),
          insideProperties: true,
          currentRequiredField: JSONSchema.required ?? [],
        }
      }

      const fatherExists = currentData ? true : false
      const newCurrentData = currentData ? currentData[node] : currentData
      const isRequired = currentInfo.currentRequiredField.indexOf(node) > -1

      return {
        ...currentInfo,
        JSONSchema: JSONSchema[node],
        currentData: newCurrentData,
        fatherExists,
        isRequired,
        invalidPointer: false,
        objectName: node,
        pointer: concatFormPointer(currentInfo.pointer, node),
        insideProperties: false,
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
      pointer: JSONSchemaRootPointer,
      insideProperties: false,
      currentRequiredField: schema.required ?? [],
    }
  )

  return {
    JSONSchema: info.JSONSchema,
    invalidPointer: info.invalidPointer,
    isRequired:
      (info.fatherIsRequired && info.isRequired) ||
      (!info.fatherIsRequired && info.isRequired && info.fatherExists),
    objectName: info.objectName,
    pointer: info.pointer,
  }
}
