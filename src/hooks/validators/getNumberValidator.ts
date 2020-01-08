import { ValidationOptions } from 'react-hook-form'

import { JSONSchemaType } from '../../JSONSchema'
import { ErrorTypes } from './types'

// Used for exclusiveMinimum and exlusiveMaximum values
const epsilon = 0.0001

export const getNumberStep = (
  currentObject: JSONSchemaType
): number | 'any' => {
  // Get dominant step value if it is defined
  const step =
    currentObject.multipleOf !== undefined
      ? currentObject.type === 'integer'
        ? parseInt(currentObject.multipleOf)
        : parseFloat(currentObject.multipleOf)
      : currentObject.type === 'integer'
      ? 1
      : 'any'
  return step
}

export const getNumberMinimum = (
  currentObject: JSONSchemaType
): number | undefined => {
  const step = getNumberStep(currentObject)

  // Calculates wether there is a minimum or exclusiveMinimum value defined somewhere
  let minimum =
    currentObject.exlusiveMinimum !== undefined
      ? currentObject.exlusiveMinimum
      : currentObject.minimum !== undefined
      ? currentObject.minimum
      : undefined
  if (minimum !== undefined && currentObject.exlusiveMinimum !== undefined) {
    if (step && step != 'any') {
      minimum += step
    } else {
      minimum += epsilon
    }
  }
  return minimum
}

export const getNumberMaximum = (
  currentObject: JSONSchemaType
): number | undefined => {
  const step = getNumberStep(currentObject)

  // Calculates wether there is a maximum or exclusiveMaximum value defined somewhere
  let maximum =
    currentObject.exlusiveMaximum !== undefined
      ? parseFloat(currentObject.exlusiveMaximum)
      : currentObject.maximum !== undefined
      ? parseFloat(currentObject.maximum)
      : undefined
  if (maximum !== undefined && currentObject.exlusiveMaximum !== undefined) {
    if (step && step != 'any') {
      maximum -= step
    } else {
      maximum -= epsilon
    }
  }

  return maximum
}

export const getNumberValidator = (
  currentObject: JSONSchemaType,
  required: boolean
): ValidationOptions => {
  const minimum = getNumberMinimum(currentObject)
  const maximum = getNumberMaximum(currentObject)

  const validator: ValidationOptions = {
    validate: {
      multipleOf: (value: string) => {
        if (currentObject.type === 'integer') {
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
    },
  }

  if (required) {
    validator.required = ErrorTypes.required
  }

  if (currentObject.type === 'integer') {
    validator.pattern = {
      value: /^([+-]?[1-9]\d*|0)$/,
      message: ErrorTypes.pattern,
    }
  } else {
    validator.pattern = {
      value: /^([0-9]+([,.][0-9]+))?$/,
      message: ErrorTypes.pattern,
    }
  }

  if (minimum || minimum === 0) {
    validator.min = {
      value: minimum,
      message: ErrorTypes.minValue,
    }
  }

  if (maximum || maximum === 0) {
    validator.max = {
      value: maximum,
      message: ErrorTypes.maxValue,
    }
  }

  return validator
}
