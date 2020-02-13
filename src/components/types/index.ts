import React from 'react'
import { FormContextValues, Mode, FieldValues } from 'react-hook-form'

import { JSONSchemaType, IDSchemaPair } from '../../JSONSchema'
import { CustomValidators } from '../../hooks/validators'

export interface JSONFormContextValues<
  FormValues extends FieldValues = FieldValues
> extends FormContextValues<FormValues> {
  schema: JSONSchemaType
  idMap: IDSchemaPair
  customValidators?: CustomValidators
}

export type OnSubmitType = (
  data: JSONSchemaType,
  event: React.BaseSyntheticEvent | undefined
) => void | Promise<void>

export type FormContextProps = {
  validationMode?: Mode
  revalidateMode?: Mode
  submitFocusError?: boolean
  onSubmit?: OnSubmitType
  noNativeValidate?: boolean
  customValidators?: CustomValidators
  schema: JSONSchemaType
}
