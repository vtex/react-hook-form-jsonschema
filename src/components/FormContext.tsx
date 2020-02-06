import React, { FC, createContext, useContext } from 'react'
import { useForm, FieldValues } from 'react-hook-form'

import { FormContextProps, JSONFormContextValues } from './types'
import { getObjectFromForm } from '../JSONSchema/internal-path-handler'

export const InternalFormContext = createContext<JSONFormContextValues | null>(
  null
)

export function useFormContext<
  T extends FieldValues = FieldValues
>(): JSONFormContextValues<T> {
  return useContext(InternalFormContext) as JSONFormContextValues<T>
}

export const FormContext: FC<FormContextProps> = props => {
  const {
    validationMode = 'onSubmit',
    revalidateMode = 'onChange',
    submitFocusError = true,
  } = props

  const methods = useForm({
    mode: validationMode,
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
