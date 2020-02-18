import { JSONSchemaType, JSONSchemaBaseInstanceTypes } from '../../JSONSchema'

const mapEnumItemsToString = (obj: JSONSchemaBaseInstanceTypes): string => {
  if (obj) {
    return obj.toString()
  }
  return ''
}

export const getEnumAsStringArray = (
  currentObject: JSONSchemaType
): string[] => {
  return currentObject.enum ? currentObject.enum.map(mapEnumItemsToString) : []
}
