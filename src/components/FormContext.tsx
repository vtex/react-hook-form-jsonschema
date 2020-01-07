import React, { FC } from 'react'
import { useForm } from 'react-hook-form'

import { FormContextProps, InternalFormContext } from './types'

export const FormContext: FC<FormContextProps> = props => {
  const methods = useForm()

  return (
    <InternalFormContext.Provider value={{ ...methods, schema: props.schema }}>
      {props.children}
    </InternalFormContext.Provider>
  )
}
