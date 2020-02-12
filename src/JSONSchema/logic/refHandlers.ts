import { JSONSchemaType, IDSchemaPair } from '../types'
import { getSplitPointer, concatFormPath } from './pathUtils'

const isAbsoluteURI = (uri: string) => {
  const absoluteRegExp = new RegExp(/^[a-z][a-z0-9+.-]*:/, 'i')
  return absoluteRegExp.test(uri)
}

const isURIFragmentPointer = (pointer: string) => {
  const fragmentRegExp = new RegExp(/^#(\/(([^#/~])|(~[01]))*)*/, 'i')
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
    let currentSchema = schema

    for (const pointer of getSplitPointer($ref)) {
      if (currentSchema) {
        currentSchema = currentSchema[pointer]
      }
    }
    return currentSchema
  }

  return IDRecord[$ref]
}

export const resolveRefs = (
  schema: JSONSchemaType,
  idMap: IDSchemaPair,
  usedRefs: Array<string>
): JSONSchemaType => {
  let resolvedRefs: JSONSchemaType = {}

  if (schema.$ref) {
    const $ref = schema.$ref

    if (usedRefs.indexOf($ref) > -1) {
      return resolvedRefs
    }
    usedRefs.push($ref)

    resolvedRefs = {
      ...schema,
      ...getSchemaFromRef($ref, idMap),
    }
  } else {
    resolvedRefs = { ...schema }
  }

  for (const key of Object.keys(resolvedRefs)) {
    if (
      typeof resolvedRefs[key] == 'object' &&
      resolvedRefs[key] !== null &&
      !Array.isArray(resolvedRefs[key])
    ) {
      if (usedRefs.indexOf(resolvedRefs[key].$ref) > -1) {
        continue
      }

      resolvedRefs[key] = resolveRefs(
        resolvedRefs[key],
        idMap,
        usedRefs.slice()
      )
    }
  }

  return resolvedRefs
}

export const getIdSchemaPairs = (schema: JSONSchemaType) => {
  const recursiveGetIdSchemaPairs = (
    currentPath: string,
    currentSchema: JSONSchemaType,
    baseUrl: URL | undefined
  ): Record<string, JSONSchemaType> => {
    let IDs: Record<string, JSONSchemaType> = {}
    IDs[currentPath] = currentSchema

    for (const key of Object.keys(currentSchema)) {
      if (
        typeof currentSchema[key] == 'object' &&
        currentSchema[key] !== null &&
        !Array.isArray(currentSchema[key])
      ) {
        IDs = {
          ...recursiveGetIdSchemaPairs(
            concatFormPath(currentPath, key),
            currentSchema[key],
            baseUrl
          ),
          ...IDs,
        }
      } else if (key === '$id') {
        // I have to declare id here, if not typescript complains, even if I
        // check if currentSchema[key] is defined
        const id = currentSchema[key]
        if (id) {
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
      }
    }
    return IDs
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
      ...recursiveGetIdSchemaPairs('#', schema, baseUrl),
    }
  }
  return recursiveGetIdSchemaPairs('#', schema, baseUrl)
}
