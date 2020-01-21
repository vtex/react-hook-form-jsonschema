export type JSONSchemaType =
  | ArrayJSONSchemaType
  | BasicJSONSchemaType
  | BooleanJSONSchemaType
  | NumberJSONSchemaType
  | ObjectJSONSchemaType
  | StringJSONSchemaType
  | NullJSONSchemaType

export interface BasicJSONSchemaType {
  type?: string | Array<string>
  title?: string
  description?: string
  $comment?: string
  $schema?: string
  $id?: string
  $ref?: string
  anyOf?: Array<JSONSchemaType>
  allOf?: Array<JSONSchemaType>
  oneOf?: Array<JSONSchemaType>
  not?: Array<JSONSchemaType>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enum?: Array<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  examples?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type PropertyDependencies = Record<string, Array<string>>
export type SchemaDependencies = JSONSchemaType
export interface ObjectJSONSchemaType extends BasicJSONSchemaType {
  type?: 'object'
  properties?: Record<string, JSONSchemaType>
  additionalProperties?: boolean
  required?: Array<string>
  propertyNames?: StringJSONSchemaType
  minProperties?: number
  maxProperties?: number
  dependencies?: PropertyDependencies | SchemaDependencies
  patternProperties?: Record<string, JSONSchemaType>
}

export interface StringJSONSchemaType extends BasicJSONSchemaType {
  type?: 'string'
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: string
  contentMediaType?: string
  contentEncoding?: string
}

export interface NumberJSONSchemaType extends BasicJSONSchemaType {
  type?: 'number' | 'integer'
  multipleOf?: number
  minimum?: number
  exclusiveMinimum?: number
  maximum?: number
  exclusiveMaximum?: number
}

export interface ArrayJSONSchemaType extends BasicJSONSchemaType {
  type?: 'array'
  items?: JSONSchemaType | Array<JSONSchemaType>
  additionalItems?: boolean | JSONSchemaType
  contains?: JSONSchemaType
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
}

export interface BooleanJSONSchemaType extends BasicJSONSchemaType {
  type?: 'boolean'
}

export interface NullJSONSchemaType extends BasicJSONSchemaType {
  type?: 'null'
}

export type JSONSchemaPathInfo = {
  JSONSchema: JSONSchemaType
  isRequired: boolean
  objectName: string
}
