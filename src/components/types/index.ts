import { FormContextValues, FieldValues, Mode, OnSubmit } from 'react-hook-form'

import { JSONSchemaType } from '../../JSONSchema'

export interface FormValuesWithSchema<T> extends FormContextValues<T> {
  schema: JSONSchemaType
}

export type FormContextProps = {
  mode?: Mode
  revalidateMode?: Mode
  submitFocusError?: boolean
  onSubmit?: OnSubmit<FieldValues>
  noNativeValidate?: boolean
  schema: JSONSchemaType
}
