import { JSONSchemaType, JSONSchemaPathInfo } from './types'
import { getObjectFromForm, getSplitPath } from './internal-path-handler'
import { useFormContext } from '../components'

const concatFormPath = (path: string, newNode: string): string => {
  return path + '/' + newNode
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

const useObjectFromForm = (data: JSONSchemaType): JSONSchemaType => {
  return getObjectFromForm(useFormContext().schema, data)
}

export { useObjectFromForm, concatFormPath, useObjectFromPath }
