import React from 'react'
import { FormContextValues, Mode } from 'react-hook-form'

import { JSONSchemaType } from '../../JSONSchema'

export interface FormValuesWithSchema<T> extends FormContextValues<T> {
  schema: JSONSchemaType
}

export type OnSubmitType = (
  data: JSONSchemaType,
  event: React.BaseSyntheticEvent
) => void | Promise<void>

export type FormContextProps = {
  mode?: Mode
  revalidateMode?: Mode
  submitFocusError?: boolean
  onSubmit?: OnSubmitType
  noNativeValidate?: boolean
  schema: JSONSchemaType
}
