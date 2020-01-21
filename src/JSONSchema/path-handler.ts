import { JSONSchemaType, JSONSchemaPathInfo } from './types'
import { useFormContext } from '../components'

const concatFormPath = (path: string, newNode: string): string => {
  return path + '/' + newNode
}

const getSplitPath = (path: string): Array<string> => {
  const split = path.split('/')
  // Removes the root path if it is present(it should always be, but if it
  // isn't this can prevent some errors)
  if (split[0] === '#') {
    split.shift()
  }
  // If there was a '/' at the end of the path before it is split(it should not
  // be there) this removes the non-existent path
  if (split[split.length - 1] === '') {
    split.pop()
  }
  return split
}

const useObjectFromPath = (path: string): JSONSchemaPathInfo => {
  const splitPath = getSplitPath(path)
  let currentJSONNode = useFormContext().schema
  let isRequired = false
  let objectName = ''

  for (let node = 0; node < splitPath.length; node++) {
    if (
      currentJSONNode &&
      currentJSONNode.type &&
      currentJSONNode.type === 'object'
    ) {
      if (
        currentJSONNode.required &&
        (currentJSONNode.required as Array<string>).indexOf(splitPath[node]) >
          -1
      ) {
        isRequired = true
      } else {
        isRequired = false
      }
      objectName = splitPath[node]
      currentJSONNode = currentJSONNode.properties[splitPath[node]]
    } else {
      currentJSONNode = {}
      break
    }
  }
  return {
    JSONSchema: currentJSONNode,
    isRequired: isRequired,
    objectName: objectName,
  }
}

const getObjectFromForm = (
  originalSchema: JSONSchemaType,
  data: JSONSchemaType
): JSONSchemaType => {
  const orderedSchemaKeys = Object.keys(data).sort()
  const objectFromData: JSONSchemaType = {}

  for (const key of orderedSchemaKeys) {
    const splitPath = getSplitPath(key)
    if (!splitPath) {
      continue
    }

    let current = objectFromData
    let currentOriginal = originalSchema

    for (let node = 0; node < splitPath.length; node++) {
      if (currentOriginal === undefined) {
        break
      }

      if (currentOriginal.type && currentOriginal.type === 'object') {
        currentOriginal = currentOriginal.properties
      } else if (
        !currentOriginal.type &&
        currentOriginal[splitPath[node]] &&
        currentOriginal[splitPath[node]].type === 'object'
      ) {
        currentOriginal = currentOriginal[splitPath[node]]
      }

      if (node === splitPath.length - 1) {
        if (
          currentOriginal[splitPath[node]] &&
          currentOriginal[splitPath[node]].type &&
          currentOriginal[splitPath[node]].type === 'integer'
        ) {
          current[splitPath[node]] = parseInt(data[key])
        } else if (
          currentOriginal[splitPath[node]] &&
          currentOriginal[splitPath[node]].type &&
          currentOriginal[splitPath[node]].type === 'number'
        ) {
          current[splitPath[node]] = parseFloat(data[key])
        } else {
          current[splitPath[node]] = data[key]
        }
      }

      if (current[splitPath[node]] === undefined) {
        current[splitPath[node]] = {}
      }

      current = current[splitPath[node]]
    }
  }

  return objectFromData
}

const useObjectFromForm = (data: JSONSchemaType): JSONSchemaType => {
  return getObjectFromForm(useFormContext().schema, data)
}

export {
  useObjectFromForm,
  concatFormPath,
  useObjectFromPath,
  getObjectFromForm,
}
