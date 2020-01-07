import { createContext } from 'react'
import { FormContextValues, useFormContext } from 'react-hook-form'

import { JSONSchemaType } from '../../JSONSchema'

export interface FormValuesWithSchema extends FormContextValues {
  schema: JSONSchemaType
}

export type FormContextProps = { schema: JSONSchemaType }
export const InternalFormContext = createContext<FormValuesWithSchema>({
  ...useFormContext(),
  schema: {},
})
