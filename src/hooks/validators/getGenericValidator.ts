import { ValidationOptions } from 'react-hook-form'

import {
  ErrorTypes,
  CustomValidators,
  CustomValidatorReturnValue,
} from './types'
import { getNumberValidator } from './getNumberValidator'
import { getStringValidator } from './getStringValidator'
import { JSONSubSchemaInfo } from '../../JSONSchema'

type GetCustomValidatorReturnType = Record<
  string,
  (value: string) => CustomValidatorReturnValue
>

function getCustomValidator(
  customValidators: CustomValidators,
  context: JSONSubSchemaInfo
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
  context: JSONSubSchemaInfo,
  customValidators: CustomValidators
): ValidationOptions => {
  const { JSONSchema, isRequired } = context

  // The use of this variable prevents a strange undocumented behaviour of react-hook-form
  // that is it fails to validate if the `validate` field exists but is empty.
  const hasValidate =
    Object.keys(customValidators).length > 0 || JSONSchema.enum
  const validator: ValidationOptions = {
    ...(hasValidate
      ? {
          validate: {
            ...getCustomValidator(customValidators, context),

            ...(JSONSchema.enum
              ? {
                  enumValidator: (value: string) => {
                    if (!JSONSchema.enum || !value) {
                      return true
                    }

                    for (const item of JSONSchema.enum) {
                      if (item == value) {
                        return true
                      }
                    }
                    return ErrorTypes.notInEnum
                  },
                }
              : undefined),
          },
        }
      : undefined),
  }

  if (isRequired) {
    validator.required = ErrorTypes.required
  }

  switch (JSONSchema.type) {
    case 'integer':
    case 'number':
      return getNumberValidator(JSONSchema, validator)
    case 'string':
      return getStringValidator(JSONSchema, validator)
    case 'boolean':
      return validator
    default:
      return {}
  }
}
