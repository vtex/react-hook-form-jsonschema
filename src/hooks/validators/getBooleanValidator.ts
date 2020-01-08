import { ValidationOptions } from 'react-hook-form'

import { ErrorTypes } from './types'

export const getBooleanValidator = (required: boolean): ValidationOptions => {
  const validator: ValidationOptions = {}

  if (required) {
    validator.required = ErrorTypes.required
  }

  return validator
}
