import { JSONSchemaPathInfo } from '../../../JSONSchema'

export enum ErrorTypes {
  required = '__form_error_required__',
  maxLength = '__form_error_maxLenght__',
  minLength = '__form_error_minLenght__',
  maxValue = '__form_error_maxValue__',
  minValue = '__form_error_minValue__',
  pattern = '__form_error_pattern__',
  notInteger = '__form_error_notInteger__',
  notFloat = '__form_error_notFloat__',
  multipleOf = '__form_error_multipleOf__',
  notInEnum = '__form_error_notInEnum',
  undefinedError = '__form_error_undefinedError__',
}

export type ErrorMessageValues = boolean | number | string | undefined

export type ErrorMessage =
  | {
      message: ErrorTypes | string
      expected: ErrorMessageValues
    }
  | undefined

export type CustomValidatorReturnValue = string | true

export type CustomValidator = (
  value: string,
  context: JSONSchemaPathInfo
) => CustomValidatorReturnValue

export type CustomValidators = Record<string, CustomValidator>
