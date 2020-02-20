import { FieldError, FormContextValues } from 'react-hook-form'

import { ErrorTypes, ErrorMessage } from './types'
import { JSONSchemaType } from '../../JSONSchema'

export const getError = (
  errors: FieldError | undefined,
  currentObject: JSONSchemaType,
  isRequired: boolean,
  formContext: FormContextValues,
  pointer: string,
  minimum?: number,
  maximum?: number,
  step?: number | 'any'
): ErrorMessage => {
  // This is a special element to check errors against
  if (currentObject.type === 'array') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentValues: any[] | undefined = formContext.getValues({
      nest: true,
    })[pointer]

    if (currentValues) {
      const numberOfSelected =
        currentValues.filter(x => x !== false).length || 0
      if (currentObject.minItems && numberOfSelected < currentObject.minItems) {
        return {
          message: ErrorTypes.minLength,
          expected: currentObject.minItems,
        }
      } else if (
        currentObject.maxItems &&
        numberOfSelected > currentObject.maxItems
      ) {
        return {
          message: ErrorTypes.maxLength,
          expected: currentObject.maxItems,
        }
      }
    }
  }

  if (!errors) {
    return undefined
  }

  const retError: ErrorMessage = {
    message:
      typeof errors.message == 'string'
        ? errors.message
        : ErrorTypes.undefinedError,
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
      retError.expected = maximum
      break
    case ErrorTypes.minValue:
      retError.message = ErrorTypes.minValue
      retError.expected = minimum
      break
    case ErrorTypes.multipleOf:
      retError.message = ErrorTypes.multipleOf
      retError.expected = step
      break
    case ErrorTypes.pattern:
      retError.message = ErrorTypes.pattern
      retError.expected = currentObject.pattern
      break
    case ErrorTypes.notInEnum:
      retError.message = ErrorTypes.notInEnum
      retError.expected = currentObject.enum
  }
  return retError
}
