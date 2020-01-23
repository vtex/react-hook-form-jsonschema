export enum ErrorTypes {
  required = '__form_error_required__',
  maxLength = '__form_error_maxLenght__',
  minLength = '__form_error_minLenght__',
  maxValue = '__form_error_maxValue__',
  minValue = '__form_error_minValue__',
  pattern = '__form_error_pattern__',
  multipleOf = '__form_error_multipleOf',
  undefinedError = '__form_error_undefinedError__',
}

export type ErrorMessageValues = boolean | number | string | undefined

export type ErrorMessage =
  | {
      message: ErrorTypes
      expected: ErrorMessageValues
    }
  | undefined
