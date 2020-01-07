import React from 'react'
import { useFormContext } from 'react-hook-form'

import { UseRadioParameters } from './types'
import { getStringValidator } from './validators'
import { useObjectFromPath } from '../JSONSchema'

export const useRadio: UseRadioParameters = path => {
  const methods = useFormContext()
  const [currentObject, isRequired] = useObjectFromPath(path)

  let validator = {}
  if (currentObject.type === 'string') {
    validator = getStringValidator(currentObject, isRequired)
  }

  return {
    getLabelProps: () => {
      const labelProps: React.ComponentProps<'label'> = {}
      labelProps.htmlFor =
        currentObject.title !== undefined ? currentObject.title : path
      return labelProps
    },
  }
}
