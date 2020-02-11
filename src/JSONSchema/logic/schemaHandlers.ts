import { JSONSchemaType, JSONSchemaPathInfo } from '../types'
import { JSONFormContextValues } from '../../components'
import { getSplitPath } from './pathUtils'

export const getObjectFromForm = (
  originalSchema: JSONSchemaType,
  data: JSONSchemaType
): JSONSchemaType => {
  const orderedSchemaKeys = Object.keys(data).sort()
  const objectFromData: JSONSchemaType = {}

  for (const key of orderedSchemaKeys) {
    const splitPath = getSplitPath(key)
    if (!splitPath && data[key]) {
      continue
    }

    let currentPath = objectFromData
    let currentOriginalPath = originalSchema

    for (let node = 0; node < splitPath.length; node++) {
      if (currentOriginalPath === undefined) {
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

        if (currentOriginalPath.type === 'integer') {
          currentPath[splitPath[node]] = parseInt(data[key])
        } else if (currentOriginalPath.type === 'number') {
          currentPath[splitPath[node]] = parseFloat(data[key])
        } else if (currentOriginalPath.type === 'boolean') {
          currentPath[splitPath[node]] = data[key] === 'true' ? true : false
        } else {
          currentPath[splitPath[node]] = data[key]
        }
      } else if (currentPath[splitPath[node]] === undefined) {
        currentPath[splitPath[node]] = {}
      }

      currentPath = currentPath[splitPath[node]]
    }
  }

  return objectFromData
}

export const getAnnotatedSchemaFromPath = (
  path: string,
  data: JSONSchemaType,
  formContext: JSONFormContextValues
): JSONSchemaPathInfo => {
  const { schema } = formContext

  const splitPath = getSplitPath(path)
  let currentJSONNode = schema
  let currentData = data

  let objectName = ''
  let isRequired = false
  let fatherIsRequired = false
  let invalidPointer = false

  let fatherExists = true

  for (let node = 0; node < splitPath.length; node++) {
    if (
      !(
        currentJSONNode &&
        currentJSONNode.type === 'object' &&
        currentJSONNode.properties
      )
    ) {
      invalidPointer = true
      currentJSONNode = {}
      break
    }
    if (currentData) {
      currentData = currentData[splitPath[node]]
    } else {
      fatherExists = false
    }

    fatherIsRequired = isRequired
    if (
      currentJSONNode.required &&
      (currentJSONNode.required as Array<string>).indexOf(splitPath[node]) > -1
    ) {
      isRequired = true
    } else {
      isRequired = false
    }

    objectName = splitPath[node]

    currentJSONNode = currentJSONNode.properties[splitPath[node]]
  }

  return {
    objectName,
    invalidPointer,
    path,
    JSONSchema: currentJSONNode,
    isRequired:
      (fatherIsRequired && isRequired) ||
      (!fatherIsRequired && isRequired && fatherExists),
  }
}
