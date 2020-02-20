import { JSONSchemaType, IDSchemaPair } from '../types'
import {
  getSplitPointer,
  concatFormPointer,
  JSONSchemaRootPointer,
} from './pathUtils'

const absoluteRegExp = /^[a-z][a-z0-9+.-]*:/i
const isAbsoluteURI = (uri: string) => {
  return absoluteRegExp.test(uri)
}

const fragmentRegExp = /^#(\/(([^#/~])|(~[01]))*)*/i
const isURIFragmentPointer = (pointer: string) => {
  return fragmentRegExp.test(pointer)
}

export const getSchemaFromRef = (
  $ref: string,
  IDRecord: Record<string, JSONSchemaType>,
  schema?: JSONSchemaType
): JSONSchemaType => {
  if (isAbsoluteURI($ref)) {
    const baseUrl = new URL($ref)

    if (baseUrl.hash) {
      return getSchemaFromRef(
        baseUrl.hash,
        IDRecord,
        IDRecord[`${baseUrl.origin}${baseUrl.pathname}`]
      )
    }
  } else if (isURIFragmentPointer($ref) && schema) {
    return getSplitPointer($ref).reduce(
      (currentSchema: JSONSchemaType, pointer: string) => {
        if (currentSchema) {
          return currentSchema[pointer]
        }
      },
      schema
    )
  }

  return IDRecord[$ref]
}

export const resolveRefs = (
  schema: JSONSchemaType,
  idMap: IDSchemaPair,
  usedRefs: string[]
): JSONSchemaType => {
  let resolvedRefs: JSONSchemaType = {}

  if (schema.$ref) {
    const $ref = schema.$ref

    if (usedRefs.indexOf($ref) > -1) {
      return resolvedRefs
    }
    usedRefs.push($ref)

    resolvedRefs = {
      ...getSchemaFromRef($ref, idMap),
    }
  } else {
    resolvedRefs = { ...schema }
  }

  return Object.keys(resolvedRefs).reduce(
    (acc: JSONSchemaType, key: string) => {
      if (
        typeof acc[key] == 'object' &&
        acc[key] !== null &&
        !Array.isArray(acc[key]) &&
        !(usedRefs.indexOf(acc[key].$ref) > -1)
      ) {
        acc[key] = resolveRefs(acc[key], idMap, usedRefs.slice())
      }
      return acc
    },
    resolvedRefs
  )
}

export const getIdSchemaPairs = (schema: JSONSchemaType) => {
  const recursiveGetIdSchemaPairs = (
    currentPointer: string,
    currentSchema: JSONSchemaType,
    baseUrl: URL | undefined
  ): Record<string, JSONSchemaType> => {
    return Object.keys(currentSchema).reduce(
      (IDs: Record<string, JSONSchemaType>, key: string) => {
        if (
          typeof currentSchema[key] == 'object' &&
          currentSchema[key] !== null &&
          !Array.isArray(currentSchema[key])
        ) {
          return {
            ...recursiveGetIdSchemaPairs(
              concatFormPointer(currentPointer, key),
              currentSchema[key],
              baseUrl
            ),
            ...IDs,
          }
        }

        const id = currentSchema[key]
        if (key === '$id' && id) {
          IDs[id] = currentSchema

          if (!isAbsoluteURI(id)) {
            try {
              IDs[new URL(id, baseUrl).href] = currentSchema
            } catch (e) {
              if (!(e instanceof TypeError)) {
                throw e
              }
            }
          }
        }
        return IDs
      },
      { [currentPointer]: currentSchema }
    )
  }

  let baseUrl: URL | undefined = undefined
  if (schema.$id && isAbsoluteURI(schema.$id)) {
    try {
      baseUrl = new URL(schema.$id)
    } catch (e) {
      baseUrl = undefined
      if (!(e instanceof TypeError)) {
        throw e
      }
    }
  }

  if (baseUrl) {
    return {
      [baseUrl.href]: schema,
      ...recursiveGetIdSchemaPairs(JSONSchemaRootPointer, schema, baseUrl),
    }
  }
  return recursiveGetIdSchemaPairs(JSONSchemaRootPointer, schema, baseUrl)
}
