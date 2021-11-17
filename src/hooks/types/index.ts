import React from 'react'
import { FieldValues, RegisterOptions } from 'react-hook-form'

import { ErrorMessage } from '../validators'
import { JSONSchemaType } from '../../JSONSchema'
import { JSONFormContextValues } from '../../components'

export enum InputTypes {
  generic = 'generic',
  radio = 'radio',
  select = 'select',
  input = 'input',
  textArea = 'textArea',
  checkbox = 'checkbox',
}

export enum UITypes {
  default = 'default',
  radio = 'radio',
  select = 'select',
  input = 'input',
  hidden = 'hidden',
  password = 'password',
  textArea = 'textArea',
  checkbox = 'checkbox',
}

export interface BasicInputReturnType {
  getError(): ErrorMessage
  getObject(): JSONSchemaType
  getCurrentValue(): FieldValues
  formContext: JSONFormContextValues
  isRequired: boolean
  name: string
  type: InputTypes
  pointer: string
  validator: RegisterOptions
}

export interface GenericInputParameters {
  (pointer: string): BasicInputReturnType
}

export interface UseRadioReturnType extends BasicInputReturnType {
  getLabelProps(): React.ComponentProps<'label'>
  getItems(): string[]
  getItemInputProps(index: number): React.ComponentProps<'input'>
  getItemLabelProps(index: number): React.ComponentProps<'label'>
}

export interface UseRadioParameters {
  (pointer: string): UseRadioReturnType
}

export interface UseCheckboxReturnType extends BasicInputReturnType {
  getItems(): string[]
  getItemInputProps(index: number): React.ComponentProps<'input'>
  getItemLabelProps(index: number): React.ComponentProps<'label'>
  isSingle: boolean
}

export interface UseCheckboxParameters {
  (pointer: string): UseCheckboxReturnType
}

export interface UseSelectReturnType extends BasicInputReturnType {
  type: InputTypes.select
  getLabelProps(): React.ComponentProps<'label'>
  getItemOptionProps(index: number): React.ComponentProps<'option'>
  getItems(): string[]
  getSelectProps(): React.ComponentProps<'select'>
}

export interface UseSelectParameters {
  (pointer: string): UseSelectReturnType
}

export interface UseRawInputReturnType extends BasicInputReturnType {
  getLabelProps(): React.ComponentProps<'label'>
  getInputProps(): React.ComponentProps<'input'>
}

export interface UseRawInputParameters {
  (baseObject: BasicInputReturnType, inputType: string): UseRawInputReturnType
}

export interface UseInputParameters {
  (pointer: string): UseRawInputReturnType
}

export interface UseTextAreaReturnType extends BasicInputReturnType {
  getLabelProps(): React.ComponentProps<'label'>
  getTextAreaProps(): React.ComponentProps<'textarea'>
}

export interface UseTextAreaParameters {
  (pointer: string): UseTextAreaReturnType
}

export type InputReturnTypes =
  | UseRawInputReturnType
  | UseTextAreaReturnType
  | UseSelectReturnType
  | UseRadioReturnType
  | UseCheckboxReturnType

export type UseObjectReturnType = InputReturnTypes[]

export type UISchemaType = {
  type: UITypes
  properties?: {
    [key: string]: UISchemaType
  }
}

export type UseObjectParameters = { pointer: string; UISchema?: UISchemaType }

export interface UseObjectProperties {
  (props: UseObjectParameters): UseObjectReturnType
}
