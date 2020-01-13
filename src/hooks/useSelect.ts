import React from 'react'
import { ValidationOptions } from 'react-hook-form'

import {
  UseSelectParameters,
  BasicInputReturnType,
  UseSelectReturnType,
} from './types'
import { useFormContext } from '../components/types'
import { useObjectFromPath } from '../JSONSchema'
import {
  getBooleanValidator,
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
  getNumberValidator,
  getStringValidator,
  toFixed,
} from './validators'
import { useGenericInput } from './useGenericInput'

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

export const getSelectCustomFields = (
  baseObject: BasicInputReturnType
): UseSelectReturnType => {
  const currentObject = baseObject.getObject()
  let validator: ValidationOptions = {}
  let items: Array<string> = ['']
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  if (currentObject.type === 'string') {
    items = items.concat(currentObject.enum ? currentObject.enum : [])
    validator = getStringValidator(currentObject, baseObject.isRequired)
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
      validator = getNumberValidator(currentObject, baseObject.isRequired)
      for (let i = minimum; i < maximum; i += step) {
        items.push(toFixed(i, decimalPlaces ? decimalPlaces : 0))
      }
    }
  } else if (currentObject.type === 'boolean') {
    validator = getBooleanValidator(baseObject.isRequired)
    items = ['true', 'false']
  }

  return {
    ...baseObject,
    getLabelProps: () => {
      const labelProps: React.ComponentProps<'label'> = {}
      labelProps.id = baseObject.path + '-label'
      labelProps.htmlFor = getSelectId(baseObject.path)

      return labelProps
    },
    getSelectProps: () => {
      const itemProps: React.ComponentProps<'select'> = {}
      itemProps.name = baseObject.path
      itemProps.ref = baseObject.formContext.register(validator)
      itemProps.required = baseObject.isRequired
      itemProps.id = getSelectId(baseObject.path)

      return itemProps
    },
    getItemOptionProps: index => {
      const itemProps: React.ComponentProps<'option'> = {}
      itemProps.id = getOptionId(baseObject.path, index, items)
      itemProps.value = items[index]

      return itemProps
    },
    getItems: () => items,
  }
}

export const useSelect: UseSelectParameters = path => {
  return getSelectCustomFields(useGenericInput(path))
}
