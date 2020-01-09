import { JSONSchemaType } from './types'
import { useFormContext } from '../components/types'
import { object } from 'prop-types'

const concatFormPath = (path: string, newNode: string): string => {
  return path + '/' + newNode
}

const getSplitPath = (path: string): Array<string> => {
  const split = path.split('/')
  if (split[0] === '#') {
    split.shift()
  }
  if (split[split.length - 1] === '') {
    split.pop()
  }
  return split
}

const useObjectFromPath = (path: string): [JSONSchemaType, boolean, string] => {
  const splitPath = getSplitPath(path)
  let currentOriginal = useFormContext().schema
  let isRequired = false
  let objectName = ''

  for (let node = 0; node < splitPath.length; node++) {
    if (
      currentOriginal &&
      currentOriginal.type &&
      currentOriginal.type === 'object'
    ) {
      if (
        currentOriginal.required &&
        (currentOriginal.required as Array<string>).indexOf(splitPath[node]) >
          -1
      ) {
        isRequired = true
      } else {
        isRequired = false
      }
      objectName = splitPath[node]
      currentOriginal = currentOriginal.properties[splitPath[node]]
    } else {
      currentOriginal = {}
      break
    }
  }
  return [currentOriginal, isRequired, objectName]
}

const useObjectFromForm = (data: JSONSchemaType): JSONSchemaType => {
  const originalSchema = useFormContext().schema
  const orderedSchemaKeys = Object.keys(data).sort()
  const objectFromData: JSONSchemaType = {}

  for (const key of orderedSchemaKeys) {
    const splitPath = getSplitPath(key)

    let current = objectFromData
    let currentOriginal = originalSchema

    if (splitPath) {
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
  }

  return objectFromData
}

export { useObjectFromForm, concatFormPath, useObjectFromPath }
