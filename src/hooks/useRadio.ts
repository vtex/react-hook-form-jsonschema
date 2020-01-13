import React from 'react'
import { ValidationOptions } from 'react-hook-form'

import {
  UseRadioParameters,
  BasicInputReturnType,
  UseRadioReturnType,
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
  return path + '-radio-input-' + (items[index] ? items[index] : '')
}

const getItemLabelId = (
  path: string,
  index: number,
  items: Array<string>
): string => {
  return path + '-radio-label-' + (items[index] ? items[index] : '')
}

export const getRadioCustomFields = (
  baseObject: BasicInputReturnType
): UseRadioReturnType => {
  const currentObject = baseObject.getObject()

  let validator: ValidationOptions = {}
  let items: Array<string> = []
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  if (currentObject.type === 'string') {
    items = currentObject.enum ? currentObject.enum : []
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
      labelProps.htmlFor =
        currentObject.title !== undefined
          ? currentObject.title
          : baseObject.path
      return labelProps
    },
    getItemInputProps: index => {
      const itemProps: React.ComponentProps<'input'> = { key: '' }
      itemProps.name = baseObject.path
      itemProps.ref = baseObject.formContext.register(validator)
      itemProps.type = 'radio'
      itemProps.required = baseObject.isRequired
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

export const useRadio: UseRadioParameters = path => {
  return getRadioCustomFields(useGenericInput(path))
}
