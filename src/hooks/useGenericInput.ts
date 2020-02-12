import { FieldError } from 'react-hook-form'

import {
  GenericInputParameters,
  BasicInputReturnType,
  InputTypes,
} from './types'
import { useFormContext, JSONFormContextValues } from '../components'
import { useAnnotatedSchemaFromPath, JSONSchemaPathInfo } from '../JSONSchema'
import { getObjectFromForm } from '../JSONSchema/logic'
import {
  getError,
  getNumberMaximum,
  getNumberMinimum,
  getNumberStep,
  getValidator,
} from './validators'

export const getGenericInput = (
  formContext: JSONFormContextValues,
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
    validator: getValidator(isRequired, formContext.customValidators ?? {}, {
      currentObject: JSONSchema,
      path,
    }),
    getError: () =>
      getError(
        formContext.errors[path]
          ? (formContext.errors[path] as FieldError)
          : undefined,
        JSONSchema,
        isRequired,
        formContext,
        path,
        minimum,
        maximum,
        step
      ),
    getObject: () => JSONSchema,
    getCurrentValue: () => {
      return formContext.getValues()[path]
    },
  }
}

export const useGenericInput: GenericInputParameters = path => {
  const formContext = useFormContext()
  const data = getObjectFromForm(formContext.schema, formContext.getValues())
  const pathInfo = useAnnotatedSchemaFromPath(path, data)
  return getGenericInput(formContext, pathInfo, path)
}
