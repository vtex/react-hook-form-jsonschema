import React, { FC, createContext, useContext, useMemo } from 'react'
import { useForm, FieldValues } from 'react-hook-form'

import { FormContextProps, JSONFormContextValues } from './types'
import {
  getObjectFromForm,
  getIdSchemaPairs,
  resolveRefs,
} from '../JSONSchema/logic'

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

  const idMap = useMemo(() => getIdSchemaPairs(props.schema), [props.schema])

  const resolvedSchemaRefs = useMemo(
    () => resolveRefs(props.schema, idMap, []),
    [props.schema, idMap]
  )

  return (
    <InternalFormContext.Provider
      value={{
        ...methods,
        schema: resolvedSchemaRefs,
        idMap: idMap,
        customValidators: props.customValidators,
      }}
    >
      <form {...formProps}>{props.children}</form>
    </InternalFormContext.Provider>
  )
}
