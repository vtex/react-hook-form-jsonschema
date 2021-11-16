import React from 'react'
import { DeepPartial, FieldValues, Mode, UseFormMethods } from 'react-hook-form'

import { JSONSchemaType, IDSchemaPair } from '../../JSONSchema'
import { CustomValidators } from '../../hooks/validators'

export interface JSONFormContextValues<
  FormValues extends FieldValues = FieldValues
> extends UseFormMethods<FormValues> {
  schema: JSONSchemaType
  idMap: IDSchemaPair
  customValidators?: CustomValidators
}

export type OnSubmitParameters = {
  data: JSONSchemaType
  event: React.BaseSyntheticEvent | undefined
  methods: JSONFormContextValues
}
export type OnSubmitType = (props: OnSubmitParameters) => void | Promise<void>

export type FormContextProps<FormValues extends FieldValues = FieldValues> = {
  formProps?: Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>
  validationMode?: Mode
  revalidateMode?: Exclude<Mode, 'onTouched' | 'all'>
  shouldFocusError?: boolean
  onChange?: (data: JSONSchemaType) => void
  onSubmit?: OnSubmitType
  noNativeValidate?: boolean
  customValidators?: CustomValidators
  schema: JSONSchemaType
  defaultValues?: DeepPartial<FormValues> | FormValues
}
