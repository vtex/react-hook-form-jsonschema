import { FieldError } from 'react-hook-form'

import { ErrorTypes, ErrorMessage } from './types'
import { JSONSchemaType } from '../../JSONSchema'

export const getError = (
  errors: FieldError | undefined,
  currentObject: JSONSchemaType,
  isRequired: boolean,
  minimum?: number,
  maximum?: number,
  step?: number | 'any'
) => {
  if (errors) {
    const retError: ErrorMessage = {
      message: ErrorTypes.undefinedError,
      expected: undefined,
    }
    switch (errors.message) {
      case ErrorTypes.required:
        retError.message = ErrorTypes.required
        retError.expected = isRequired
        break
      case ErrorTypes.maxLength:
        retError.message = ErrorTypes.maxLength
        retError.expected = currentObject.maxLength
        break
      case ErrorTypes.minLength:
        retError.message = ErrorTypes.minLength
        retError.expected = currentObject.minLength
        break
      case ErrorTypes.maxValue:
        retError.message = ErrorTypes.maxValue
        retError.expected = minimum
        break
      case ErrorTypes.minValue:
        retError.message = ErrorTypes.minValue
        retError.expected = maximum
        break
      case ErrorTypes.multipleOf:
        retError.message = ErrorTypes.multipleOf
        retError.expected = step
        break
      case ErrorTypes.pattern:
        retError.message = ErrorTypes.pattern
        retError.expected = currentObject.pattern
        break
    }
    return retError
  } else {
    return undefined
  }
}
