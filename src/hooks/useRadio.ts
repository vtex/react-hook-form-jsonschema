import React from 'react'
import { ValidationOptions, FieldError } from 'react-hook-form'

import { UseRadioParameters } from './types'
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

export const useRadio: UseRadioParameters = path => {
  const { register, errors } = useFormContext()
  const [currentObject, isRequired] = useObjectFromPath(path)

  let validator: ValidationOptions = {}
  let items: Array<string> = []
  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'
  let decimalPlaces: number | undefined

  if (currentObject.type === 'string') {
    items = currentObject.enum ? currentObject.enum : []
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
      labelProps.htmlFor =
        currentObject.title !== undefined ? currentObject.title : path
      return labelProps
    },
    getItemInputProps: index => {
      const itemProps: React.ComponentProps<'input'> = { key: '' }
      itemProps.name = path
      itemProps.ref = register(validator)
      itemProps.type = 'radio'
      itemProps.required = isRequired
      itemProps.id = getItemInputId(path, index, items)
      itemProps.value = items[index]

      return itemProps
    },
    getItemLabelProps: index => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getItemLabelId(path, index, items)
      itemProps.htmlFor = getItemInputId(path, index, items)

      return itemProps
    },
    getItems: () => items,
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
