import { ValidationOptions } from 'react-hook-form'

import { JSONSchemaType } from '../../JSONSchema'
import { ErrorTypes } from './types'

// Used for exclusiveMinimum and exclusiveMaximum values
const EPSILON = 0.0001

export const toFixed = (value: number, precision: number): string => {
  const power = Math.pow(10, precision || 0)
  return String(Math.round(value * power) / power)
}

export const getNumberStep = (
  currentObject: JSONSchemaType
): [number | 'any', number | undefined] => {
  // Get dominant step value if it is defined
  const step =
    currentObject.multipleOf !== undefined
      ? currentObject.type === 'integer'
        ? parseInt(currentObject.multipleOf)
        : parseFloat(currentObject.multipleOf)
      : currentObject.type === 'integer'
      ? 1
      : 'any'

  let decimalPlaces = undefined
  if (currentObject.multipleOf) {
    const decimals = currentObject.multipleOf.toString().split('.')[1]
    if (decimals) {
      decimalPlaces = decimals.length
    } else {
      decimalPlaces = 0
    }
  }

  return [step, decimalPlaces]
}

export const getNumberMinimum = (
  currentObject: JSONSchemaType
): number | undefined => {
  const [step] = getNumberStep(currentObject)

  // Calculates whether there is a minimum or exclusiveMinimum value defined somewhere
  let minimum =
    currentObject.exclusiveMinimum !== undefined
      ? currentObject.exclusiveMinimum
      : currentObject.minimum !== undefined
      ? currentObject.minimum
      : undefined
  if (minimum !== undefined && currentObject.exclusiveMinimum !== undefined) {
    if (step && step != 'any') {
      minimum += step
    } else {
      minimum += EPSILON
    }
  }
  return minimum
}

export const getNumberMaximum = (
  currentObject: JSONSchemaType
): number | undefined => {
  const [step] = getNumberStep(currentObject)

  // Calculates wether there is a maximum or exclusiveMaximum value defined somewhere
  let maximum =
    currentObject.exclusiveMaximum !== undefined
      ? parseFloat(currentObject.exclusiveMaximum)
      : currentObject.maximum !== undefined
      ? parseFloat(currentObject.maximum)
      : undefined
  if (maximum !== undefined && currentObject.exclusiveMaximum !== undefined) {
    if (step && step != 'any') {
      maximum -= step
    } else {
      maximum -= EPSILON
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
