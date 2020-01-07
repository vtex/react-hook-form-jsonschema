import { ValidationOptions } from 'react-hook-form'

import { JSONSchemaType } from '../../JSONSchema'
import { ErrorTypes } from './types'

export const getStringValidator = (
  currentObject: JSONSchemaType,
  required: boolean
): ValidationOptions => {
  const validator: ValidationOptions = {}

  if (required) {
    validator.required = ErrorTypes.required
  }

  if (currentObject.minLength) {
    validator.minLength = {
      value: currentObject.minLength,
      message: ErrorTypes.minLength,
    }
  }

  if (currentObject.maxLength) {
    validator.maxLength = {
      value: currentObject.maxLength,
      message: ErrorTypes.maxLength,
    }
  }

  if (currentObject.pattern) {
    validator.pattern = {
      value: new RegExp(currentObject.pattern),
      message: ErrorTypes.pattern,
    }
  }
  return validator
}
