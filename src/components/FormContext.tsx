import React, { FC, createContext, useContext } from 'react'
import { useForm, FieldValues } from 'react-hook-form'

import { FormContextProps, FormValuesWithSchema } from './types'

export const InternalFormContext = createContext<FormValuesWithSchema<
  FieldValues
> | null>(null)

export function useFormContext<T extends FieldValues>(): FormValuesWithSchema<
  T
> {
  return useContext(InternalFormContext) as FormValuesWithSchema<T>
}

export const FormContext: FC<FormContextProps> = props => {
  const methods = useForm({
    mode: props.mode || 'onSubmit',
    reValidateMode: props.revalidateMode || 'onChange',
    submitFocusError: props.submitFocusError || true,
  })

  const formProps: React.ComponentProps<'form'> = {}
  if (props.onSubmit) {
    formProps.onSubmit = methods.handleSubmit(props.onSubmit)
  }
  return (
    <InternalFormContext.Provider value={{ ...methods, schema: props.schema }}>
      <form {...formProps} noValidate>
        {props.children}
      </form>
    </InternalFormContext.Provider>
  )
}
