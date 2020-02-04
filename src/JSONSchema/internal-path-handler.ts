import { JSONSchemaType } from './types'

export const getSplitPath = (path: string): Array<string> => {
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

export const getObjectFromForm = (
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

    let currentPath = objectFromData
    let currentOriginalPath = originalSchema

    for (let node = 0; node < splitPath.length; node++) {
      if (currentOriginalPath === undefined) {
        break
      }

      if (currentOriginalPath.type && currentOriginalPath.type === 'object') {
        currentOriginalPath = currentOriginalPath.properties
        currentOriginalPath = currentOriginalPath[splitPath[node]]
      } else if (
        !currentOriginalPath.type &&
        currentOriginalPath[splitPath[node]] &&
        currentOriginalPath[splitPath[node]].type === 'object'
      ) {
        currentOriginalPath = currentOriginalPath[splitPath[node]]
      }

      if (node === splitPath.length - 1 && data[key]) {
        if (currentOriginalPath && currentOriginalPath.type === 'integer') {
          currentPath[splitPath[node]] = parseInt(data[key])
        } else if (
          currentOriginalPath &&
          currentOriginalPath.type === 'number'
        ) {
          currentPath[splitPath[node]] = parseFloat(data[key])
        } else if (
          currentOriginalPath &&
          currentOriginalPath.type === 'boolean'
        ) {
          currentPath[splitPath[node]] = data[key] === 'true' ? true : false
        } else if (currentOriginalPath) {
          currentPath[splitPath[node]] = data[key]
        }
      } else if (currentPath[splitPath[node]] === undefined && data[key]) {
        currentPath[splitPath[node]] = {}
      }

      currentPath = currentPath[splitPath[node]]
    }
  }

  return objectFromData
}
