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
    formProps: userFormProps,
    onChange,
    validationMode = 'onSubmit',
    revalidateMode = 'onChange',
    submitFocusError = true,
    defaultValues,
  } = props

  const methods = useForm({
    defaultValues,
    mode: validationMode,
    reValidateMode: revalidateMode,
    submitFocusError: submitFocusError,
  })

  const isFirstRender = React.useRef(true)

  const watchedInputs = methods.watch()

  if (isFirstRender.current === true) {
    isFirstRender.current = false
  } else if (typeof onChange === 'function') {
    onChange(getObjectFromForm(props.schema, watchedInputs))
  }

  const idMap = useMemo(() => getIdSchemaPairs(props.schema), [props.schema])

  const resolvedSchemaRefs = useMemo(
    () => resolveRefs(props.schema, idMap, []),
    [props.schema, idMap]
  )

  const formContext: JSONFormContextValues = useMemo(() => {
    return {
      ...methods,
      schema: resolvedSchemaRefs,
      idMap: idMap,
      customValidators: props.customValidators,
    }
  }, [methods, resolvedSchemaRefs, idMap, props.customValidators])

  const formProps: React.ComponentProps<'form'> = { ...userFormProps }

  formProps.onSubmit = methods.handleSubmit(async (data, event) => {
    if (props.onSubmit) {
      return props.onSubmit({
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
