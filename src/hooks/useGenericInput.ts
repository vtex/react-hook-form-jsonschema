import { FormContextValues, FieldError } from 'react-hook-form'

import {
  GenericInputParameters,
  BasicInputReturnType,
  InputTypes,
} from './types'
import { useFormContext } from '../components'
import { useObjectFromPath, JSONSchemaType } from '../JSONSchema'
import {
  getError,
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
} from './validators'

export const getGenericInput = (
  formContext: FormContextValues,
  pathInfo: [JSONSchemaType, boolean, string],
  path: string
): BasicInputReturnType => {
  const currentObject = pathInfo[0]
  const isRequired = pathInfo[1]
  const currentName = pathInfo[2]

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
    type: InputTypes.generic,
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

export const useGenericInput: GenericInputParameters = path => {
  const formContext = useFormContext()
  const pathInfo = useObjectFromPath(path)
  return getGenericInput(formContext, pathInfo, path)
}
