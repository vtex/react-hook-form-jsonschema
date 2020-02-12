import { ValidationOptions } from 'react-hook-form'

import {
  ErrorTypes,
  CustomValidatorContext,
  CustomValidators,
  CustomValidatorReturnValue,
} from './types'
import { getNumberValidator } from './getNumberValidator'
import { getStringValidator } from './getStringValidator'

type GetCustomValidatorReturnType = Record<
  string,
  (value: string) => CustomValidatorReturnValue
>

function getCustomValidator(
  customValidators: CustomValidators,
  context: CustomValidatorContext
): GetCustomValidatorReturnType {
  return Object.keys(customValidators).reduce(
    (acc: GetCustomValidatorReturnType, key: string) => {
      acc[key] = (value: string) => {
        return customValidators[key](value, context)
      }
      return acc
    },
    {}
  )
}

export const getValidator = (
  required: boolean,
  customValidators: CustomValidators,
  context: CustomValidatorContext
): ValidationOptions => {
  const { currentObject } = context

  // The use of this variable prevents a strange undocumented behaviour of react-hook-form
  // that is it fails to validate if the `validate` field exists but is empty.
  const hasValidate =
    Object.keys(customValidators).length > 0 || currentObject.enum
  const validator: ValidationOptions = {
    ...(hasValidate
      ? {
          validate: {
            ...getCustomValidator(customValidators, context),

            ...(currentObject.enum
              ? {
                  enumValidator: (value: string) => {
                    if (!currentObject.enum || !value) {
                      return true
                    }

                    for (const item of currentObject.enum) {
                      if (item == value) {
                        return true
                      }
                    }
                    return false
                  },
                }
              : undefined),
          },
        }
      : undefined),
  }

  if (required) {
    validator.required = ErrorTypes.required
  }

  switch (currentObject.type) {
    case 'integer':
    case 'number':
      return getNumberValidator(currentObject, validator)
    case 'string':
      return getStringValidator(currentObject, validator)
    case 'boolean':
      return validator
    default:
      return {}
  }
}
