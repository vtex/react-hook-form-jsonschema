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

  const idMap = useMemo(() => getIdSchemaPairs(props.schema), [props.schema])

  const resolvedSchemaRefs = useMemo(
    () => resolveRefs(props.schema, idMap, []),
    [props.schema, idMap]
  )

  const formContext: JSONFormContextValues = {
    ...methods,
    schema: resolvedSchemaRefs,
    idMap: idMap,
    customValidators: props.customValidators,
  }

  const formProps: React.ComponentProps<'form'> = {}

  formProps.onSubmit = methods.handleSubmit(async (data, event) => {
    if (props.onSubmit) {
      return await props.onSubmit({
        data: getObjectFromForm(props.schema, data),
        event: event,
        methods: formContext,
      })
    }
    return
  })

  if (props.noNativeValidate) {
    formProps.noValidate = props.noNativeValidate
  }

  return (
    <InternalFormContext.Provider value={formContext}>
      <form {...formProps}>{props.children}</form>
    </InternalFormContext.Provider>
  )
}
