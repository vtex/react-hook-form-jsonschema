import React from 'react'
import { ValidationOptions } from 'react-hook-form'

import { UseRadioParameters } from './types'
import { getStringValidator } from './validators'
import { useFormContext } from '../components/types'
import { useObjectFromPath } from '../JSONSchema'
import {
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
  getNumberValidator,
} from './validators/getNumberValidator'

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
  const { register } = useFormContext()
  const [currentObject, isRequired] = useObjectFromPath(path)

  let validator: ValidationOptions = {}
  let items: Array<string> = []
  if (currentObject.type === 'string') {
    items = currentObject.enum ? currentObject.enum : []
    validator = getStringValidator(currentObject, isRequired)
  } else if (
    currentObject.type === 'number' ||
    currentObject.type === 'integer'
  ) {
    const minimum = getNumberMinimum(currentObject)
    const maximum = getNumberMaximum(currentObject)
    const step = getNumberStep(currentObject)
    if (minimum && maximum && step != 'any') {
      validator = getNumberValidator(currentObject, isRequired)
      for (let i = minimum; i < maximum; i += step) {
        items.push(i.toString())
      }
    }
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
      itemProps.value =
        currentObject.enum && currentObject.enum[index]
          ? currentObject.enum[index]
          : ''

      return itemProps
    },
    getItemLabelProps: index => {
      const itemProps: React.ComponentProps<'label'> = {}
      itemProps.id = getItemLabelId(path, index, items)
      itemProps.htmlFor = getItemInputId(path, index, items)

      return itemProps
    },
    getItems: () => items,
  }
}
