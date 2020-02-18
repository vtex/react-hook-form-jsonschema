import React from 'react'

import {
  UseCheckboxParameters,
  BasicInputReturnType,
  UseCheckboxReturnType,
  InputTypes,
} from './types'
import {
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
  toFixed,
} from './validators'
import { useGenericInput } from './useGenericInput'
import { getEnumAsStringArray } from './validators/getEnum'

const getItemInputId = (
  path: string,
  index: number,
  items: string[]
): string => {
  return path + '-checkbox-input-' + (items[index] ? items[index] : '')
}

const getItemLabelId = (
  path: string,
  index: number,
  items: string[]
): string => {
  return path + '-checkbox-label-' + (items[index] ? items[index] : '')
}

export const getCheckboxCustomFields = (
  baseInput: BasicInputReturnType
): UseCheckboxReturnType => {
  const { register } = baseInput.formContext
  const { validator } = baseInput

  const currentObject = baseInput.getObject()

  let items: string[] = []
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  if (currentObject.type === 'array') {
    if (currentObject.items.enum) {
      items = getEnumAsStringArray(currentObject.items)
    } else if (currentObject.items.type === 'string') {
      items = getEnumAsStringArray(currentObject)
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
        for (let i = minimum; i <= maximum; i += step) {
          items.push(toFixed(i, decimalPlaces || 0))
        }
      }
    }

    if (currentObject.uniqueItems) {
      items = [...new Set(items)]
    }
  } else if (currentObject.type === 'boolean') {
    items = ['true']
  }

  return {
    ...baseInput,
    type: InputTypes.checkbox,
    isSingle: currentObject.type === 'boolean',
    getItemInputProps: index => {
      const itemProps: React.ComponentProps<'input'> = { key: '' }
      // This ternary decides wether to treat the input as an array or not
      itemProps.name =
        currentObject.type === 'array'
          ? `${baseInput.path}[${index}]`
          : baseInput.path
      itemProps.ref = register(validator)
      itemProps.type = 'checkbox'
      itemProps.id = getItemInputId(baseInput.path, index, items)
      itemProps.value = items[index]

      return itemProps
    },
    getItemLabelProps: index => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getItemLabelId(baseInput.path, index, items)
      itemProps.htmlFor = getItemInputId(baseInput.path, index, items)

      return itemProps
    },
    getItems: () => items,
  }
}

export const useCheckbox: UseCheckboxParameters = path => {
  return getCheckboxCustomFields(useGenericInput(path))
}
