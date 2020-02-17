import { ValidationOptions } from 'react-hook-form'

import { getNumberMaximum, getNumberMinimum } from './numberUtilities'
import { JSONSchemaType } from '../../JSONSchema'
import { ErrorTypes } from './types'

export const getNumberValidator = (
  currentObject: JSONSchemaType,
  baseValidator: ValidationOptions
): ValidationOptions => {
  const minimum = getNumberMinimum(currentObject)
  const maximum = getNumberMaximum(currentObject)

  baseValidator.validate = {
    ...baseValidator.validate,
    multipleOf: (value: string) => {
      if (currentObject.type === 'integer' && value) {
        return (
          currentObject.multipleOf &&
          (parseInt(value) % parseInt(currentObject.multipleOf) === 0 ||
            ErrorTypes.multipleOf)
        )
      } else {
        // TODO: implement float checking with epsilon
        return true
      }
    },
  }

  if (currentObject.type === 'integer') {
    baseValidator.pattern = {
      value: /^([+-]?[1-9]\d*|0)$/,
      message: ErrorTypes.notInteger,
    }
  } else {
    baseValidator.pattern = {
      value: /^([+-]?[0-9]+([.][0-9]+))?$/,
      message: ErrorTypes.notFloat,
    }
  }

  if (minimum || minimum === 0) {
    baseValidator.min = {
      value: minimum,
      message: ErrorTypes.minValue,
    }
  }

  if (maximum || maximum === 0) {
    baseValidator.max = {
      value: maximum,
      message: ErrorTypes.maxValue,
    }
  }

  return baseValidator
}
