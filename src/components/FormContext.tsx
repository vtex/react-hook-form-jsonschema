import React, { FC, createContext, useContext } from 'react'
import { useForm, FieldValues } from 'react-hook-form'

import { FormContextProps, FormValuesWithSchema } from './types'
import { getObjectFromForm } from '../JSONSchema/internal-path-handler'

export const InternalFormContext = createContext<FormValuesWithSchema<
  FieldValues
> | null>(null)

export function useFormContext<T extends FieldValues>(): FormValuesWithSchema<
  T
> {
  return useContext(InternalFormContext) as FormValuesWithSchema<T>
}

export const FormContext: FC<FormContextProps> = props => {
  const {
    mode = 'onSubmit',
    revalidateMode = 'onChange',
    submitFocusError = true,
  } = props

  const methods = useForm({
    mode: mode,
    reValidateMode: revalidateMode,
    submitFocusError: submitFocusError,
  })

  const formProps: React.ComponentProps<'form'> = {}

  formProps.onSubmit = methods.handleSubmit((data, event) => {
    if (props.onSubmit) {
      props.onSubmit(getObjectFromForm(props.schema, data), event)
    }
    return
  })

  if (props.noNativeValidate) {
    formProps.noValidate = props.noNativeValidate
  }
  return (
    <InternalFormContext.Provider value={{ ...methods, schema: props.schema }}>
      <form {...formProps}>{props.children}</form>
    </InternalFormContext.Provider>
  )
}
