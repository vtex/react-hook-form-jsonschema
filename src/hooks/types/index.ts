import React from 'react'
import { FormContextValues } from 'react-hook-form'

import { ErrorMessage } from '../validators'
import { JSONSchemaType } from '../../JSONSchema'

export interface BasicInputReturnType {
  getError(): ErrorMessage
  getObject(): JSONSchemaType
  formContext: FormContextValues
  isRequired: boolean
  name: string
  path: string
}

export interface GenericInputParameters {
  (path: string): BasicInputReturnType
}

export interface UseRadioReturnType extends BasicInputReturnType {
  getLabelProps(): React.ComponentProps<'label'>
  getItems(): Array<string>
  getItemInputProps(index: number): React.ComponentProps<'input'>
  getItemLabelProps(index: number): React.ComponentProps<'label'>
}

export interface UseRadioParameters {
  (path: string): UseRadioReturnType
}

export interface UseSelectReturnType extends BasicInputReturnType {
  getLabelProps(): React.ComponentProps<'label'>
  getItemOptionProps(index: number): React.ComponentProps<'option'>
  getItems(): Array<string>
  getSelectProps(): React.ComponentProps<'select'>
}

export interface UseSelectParameters {
  (path: string): UseSelectReturnType
}

export interface UseRawInputReturnType extends BasicInputReturnType {
  getLabelProps(): React.ComponentProps<'label'>
  getInputProps(): React.ComponentProps<'input'>
}

export interface UseRawInputParameters {
  (baseObject: BasicInputReturnType, inputType: string): UseRawInputReturnType
}

export interface UseInputParameters {
  (path: string): UseRawInputReturnType
}

export interface UseTextAreaReturnType extends BasicInputReturnType {
  getLabelProps(): React.ComponentProps<'label'>
  getTextAreaProps(): React.ComponentProps<'textarea'>
}

export interface UseTextAreaParameters {
  (path: string): UseTextAreaReturnType
}

export type UseObjectReturnType = Array<
  | UseRawInputReturnType
  | UseTextAreaReturnType
  | UseSelectReturnType
  | UseRadioReturnType
>

export interface UseObjectProperties {
  (path: string): UseObjectReturnType
}
