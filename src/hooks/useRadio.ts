import React from 'react'

import {
  UseRadioParameters,
  BasicInputReturnType,
  UseRadioReturnType,
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
  return path + '-radio-input-' + (items[index] ? items[index] : '')
}

const getItemLabelId = (
  path: string,
  index: number,
  items: string[]
): string => {
  return path + '-radio-label-' + (items[index] ? items[index] : '')
}

export const getRadioCustomFields = (
  baseInput: BasicInputReturnType
): UseRadioReturnType => {
  const { register } = baseInput.formContext
  const { validator } = baseInput

  const currentObject = baseInput.getObject()

  let items: string[] = []
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  if (currentObject.type === 'string') {
    items = getEnumAsStringArray(currentObject)
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
      for (let i = minimum; i <= maximum; i += step) {
        items.push(toFixed(i, decimalPlaces ? decimalPlaces : 0))
      }
    }
  } else if (currentObject.type === 'boolean') {
    items = ['true', 'false']
  }

  return {
    ...baseInput,
    type: InputTypes.radio,
    getLabelProps: () => {
      const labelProps: React.ComponentProps<'label'> = {}
      labelProps.id = baseInput.path + '-label'
      labelProps.htmlFor =
        currentObject.title !== undefined ? currentObject.title : baseInput.path
      return labelProps
    },
    getItemInputProps: index => {
      const itemProps: React.ComponentProps<'input'> = { key: '' }
      itemProps.name = baseInput.path
      itemProps.ref = register(validator)
      itemProps.type = 'radio'
      itemProps.required = baseInput.isRequired
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

export const useRadio: UseRadioParameters = path => {
  return getRadioCustomFields(useGenericInput(path))
}
