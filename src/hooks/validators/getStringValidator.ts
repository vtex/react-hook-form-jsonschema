import { RegisterOptions } from 'react-hook-form'

import { JSONSchemaType } from '../../JSONSchema'
import { ErrorTypes } from './types'

export const getStringValidator = (
  currentObject: JSONSchemaType,
  baseValidator: RegisterOptions
): RegisterOptions => {
  if (currentObject.minLength) {
    baseValidator.minLength = {
      value: currentObject.minLength,
      message: ErrorTypes.minLength,
    }
  }

  if (currentObject.maxLength) {
    baseValidator.maxLength = {
      value: currentObject.maxLength,
      message: ErrorTypes.maxLength,
    }
  }

  if (currentObject.pattern) {
    baseValidator.pattern = {
      value: new RegExp(currentObject.pattern),
      message: ErrorTypes.pattern,
    }
  }
  return baseValidator
}
