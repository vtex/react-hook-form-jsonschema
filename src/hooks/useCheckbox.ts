import React from 'react'
import { ValidationOptions } from 'react-hook-form'

import {
  UseCheckboxParameters,
  BasicInputReturnType,
  UseCheckboxReturnType,
  InputTypes,
} from './types'
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

const getItemInputId = (
  path: string,
  index: number,
  items: Array<string>
): string => {
  return path + '-checkbox-input-' + (items[index] ? items[index] : '')
}

const getItemLabelId = (
  path: string,
  index: number,
  items: Array<string>
): string => {
  return path + '-checkbox-label-' + (items[index] ? items[index] : '')
}

export const getCheckboxCustomFields = (
  baseObject: BasicInputReturnType
): UseCheckboxReturnType => {
  const currentObject = baseObject.getObject()

  let validator: ValidationOptions = {}
  let items: Array<string> = []
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  if (currentObject.type === 'array') {
    if (currentObject.items.enum) {
      items = currentObject.items.enum
    } else if (currentObject.items.type === 'string') {
      items = currentObject.enum ? currentObject.enum : []
      validator = getStringValidator(currentObject, baseObject.isRequired)
    } else if (
      currentObject.items.type === 'number' ||
      currentObject.items.type === 'integer'
    ) {
      const stepAndDecimalPlaces = getNumberStep(currentObject)
      step = stepAndDecimalPlaces[0]
      decimalPlaces = stepAndDecimalPlaces[1]

      minimum = getNumberMinimum(currentObject)
      maximum = getNumberMaximum(currentObject)

      if (minimum !== undefined && maximum !== undefined && step != 'any') {
        validator = getNumberValidator(currentObject, baseObject.isRequired)
        for (let i = minimum; i <= maximum; i += step) {
          items.push(toFixed(i, decimalPlaces || 0))
        }
      }
    }

    if (currentObject.uniqueItems) {
      items = [...new Set(items)]
    }
  } else if (currentObject.type === 'boolean') {
    validator = getBooleanValidator(baseObject.isRequired)
    items = ['true']
  }

  return {
    ...baseObject,
    validator,
    type: InputTypes.checkbox,
    isSingle: currentObject.type === 'boolean',
    getItemInputProps: index => {
      const itemProps: React.ComponentProps<'input'> = { key: '' }
      // This ternary decides wether to treat the input as an array or not
      itemProps.name =
        currentObject.type === 'array'
          ? `${baseObject.path}[${index}]`
          : baseObject.path
      itemProps.ref = baseObject.formContext.register(validator)
      itemProps.type = 'checkbox'
      itemProps.id = getItemInputId(baseObject.path, index, items)
      itemProps.value = items[index]

      return itemProps
    },
    getItemLabelProps: index => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getItemLabelId(baseObject.path, index, items)
      itemProps.htmlFor = getItemInputId(baseObject.path, index, items)

      return itemProps
    },
    getItems: () => items,
  }
}

export const useCheckbox: UseCheckboxParameters = path => {
  return getCheckboxCustomFields(useGenericInput(path))
}
