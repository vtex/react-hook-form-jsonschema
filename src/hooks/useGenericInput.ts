import { FormContextValues, FieldError } from 'react-hook-form'

import {
  GenericInputParameters,
  BasicInputReturnType,
  InputTypes,
} from './types'
import { useFormContext } from '../components'
import { useObjectFromPath, JSONSchemaPathInfo } from '../JSONSchema'
import {
  getError,
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
} from './validators'

export const getGenericInput = (
  formContext: FormContextValues,
  pathInfo: JSONSchemaPathInfo,
  path: string
): BasicInputReturnType => {
  const { JSONSchema, isRequired, objectName } = pathInfo

  let minimum: number | undefined
  let maximum: number | undefined
  let step: number | 'any'

  if (JSONSchema.type === 'number' || JSONSchema.type === 'integer') {
    const stepAndDecimalPlaces = getNumberStep(JSONSchema)
    step = stepAndDecimalPlaces[0]

    minimum = getNumberMinimum(JSONSchema)
    maximum = getNumberMaximum(JSONSchema)
  }

  return {
    name: objectName,
    path: path,
    isRequired: isRequired,
    formContext: formContext,
    type: InputTypes.generic,
    validator: {},
    getError: () =>
      getError(
        formContext.errors[path]
          ? (formContext.errors[path] as FieldError)
          : undefined,
        JSONSchema,
        isRequired,
        minimum,
        maximum,
        step
      ),
    getObject: () => JSONSchema,
  }
}

export const useGenericInput: GenericInputParameters = path => {
  const formContext = useFormContext()
  const pathInfo = useObjectFromPath(path)
  return getGenericInput(formContext, pathInfo, path)
}
