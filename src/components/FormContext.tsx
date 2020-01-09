import React, { FC } from 'react'
import { useForm } from 'react-hook-form'

import { FormContextProps, InternalFormContext } from './types'

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
