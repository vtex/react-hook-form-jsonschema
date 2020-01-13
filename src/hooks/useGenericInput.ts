import { FieldError } from 'react-hook-form'

import { GenericInputParameters } from './types'
import { useFormContext } from '../components/types'
import { useObjectFromPath } from '../JSONSchema'
import {
  getError,
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
} from './validators'

export const useGenericInput: GenericInputParameters = path => {
  const formContext = useFormContext()
  const [currentObject, isRequired, currentName] = useObjectFromPath(path)

  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'

  if (currentObject.type === 'number' || currentObject.type === 'integer') {
    const stepAndDecimalPlaces = getNumberStep(currentObject)
    step = stepAndDecimalPlaces[0]

    minimum = getNumberMinimum(currentObject)
    maximum = getNumberMaximum(currentObject)
  }

  return {
    name: currentName,
    path: path,
    isRequired: isRequired,
    formContext: formContext,
    getError: () =>
      getError(
        formContext.errors[path]
          ? (formContext.errors[path] as FieldError)
          : undefined,
        currentObject,
        isRequired,
        minimum,
        maximum,
        step
      ),
    getObject: () => currentObject,
  }
}
