import React from 'react'
import { ValidationOptions, FieldError } from 'react-hook-form'

import { UseSelectParameters } from './types'
import { useFormContext } from '../components/types'
import { useObjectFromPath } from '../JSONSchema'
import {
  getBooleanValidator,
  getError,
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
  getNumberValidator,
  getStringValidator,
  toFixed,
} from './validators'

const getSelectId = (path: string): string => {
  return path + '-select'
}

const getOptionId = (
  path: string,
  index: number,
  items: Array<string>
): string => {
  return path + '-select-option-' + (items[index] ? items[index] : '')
}

export const useSelect: UseSelectParameters = path => {
  const { register, errors } = useFormContext()
  const [currentObject, isRequired, currentName] = useObjectFromPath(path)

  let validator: ValidationOptions = {}
  let items: Array<string> = ['']
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  if (currentObject.type === 'string') {
    items = items.concat(currentObject.enum ? currentObject.enum : [])
    validator = getStringValidator(currentObject, isRequired)
  } else if (
    currentObject.type === 'number' ||
    currentObject.type === 'integer'
  ) {
    const stepAndDecimalPlaces = getNumberStep(currentObject)
    step = stepAndDecimalPlaces[0]
    decimalPlaces = stepAndDecimalPlaces[1]

    minimum = getNumberMinimum(currentObject)
    maximum = getNumberMaximum(currentObject)

    if (minimum !== undefined && maximum !== undefined && step != 'any') {
      validator = getNumberValidator(currentObject, isRequired)
      for (let i = minimum; i < maximum; i += step) {
        items.push(toFixed(i, decimalPlaces ? decimalPlaces : 0))
      }
    }
  } else if (currentObject.type === 'boolean') {
    validator = getBooleanValidator(isRequired)
    items = ['true', 'false']
  }

  return {
    getLabelProps: () => {
      const labelProps: React.ComponentProps<'label'> = {}
      labelProps.id = path + '-label'
      labelProps.htmlFor = getSelectId(path)

      return labelProps
    },
    getSelectProps: () => {
      const itemProps: React.ComponentProps<'select'> = {}
      itemProps.name = path
      itemProps.ref = register(validator)
      itemProps.required = isRequired
      itemProps.id = getSelectId(path)

      return itemProps
    },
    getItemOptionProps: index => {
      const itemProps: React.ComponentProps<'option'> = {}
      itemProps.id = getOptionId(path, index, items)
      itemProps.value = items[index]

      return itemProps
    },
    getItems: () => items,
    getName: () => currentName,
    getError: () =>
      getError(
        errors[path] ? (errors[path] as FieldError) : undefined,
        currentObject,
        isRequired,
        minimum,
        maximum,
        step
      ),
  }
}
