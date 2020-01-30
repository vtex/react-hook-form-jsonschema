import React from 'react'
import { FormContextValues, ValidationOptions } from 'react-hook-form'

import { ErrorMessage } from '../validators'
import { JSONSchemaType } from '../../JSONSchema'

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
  formContext: FormContextValues
  isRequired: boolean
  name: string
  path: string
  type: InputTypes
  validator: ValidationOptions
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

export interface UseCheckboxReturnType extends BasicInputReturnType {
  getItems(): Array<string>
  getItemInputProps(index: number): React.ComponentProps<'input'>
  getItemLabelProps(index: number): React.ComponentProps<'label'>
  isSingle: boolean
}

export interface UseCheckboxParameters {
  (path: string): UseCheckboxReturnType
}

export interface UseSelectReturnType extends BasicInputReturnType {
  type: InputTypes.select
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

export type InputReturnTypes =
  | UseRawInputReturnType
  | UseTextAreaReturnType
  | UseSelectReturnType
  | UseRadioReturnType
  | UseCheckboxReturnType

export type UseObjectReturnType = Array<InputReturnTypes>

export type UISchemaType = {
  type: UITypes
  properties?: {
    [key: string]: UISchemaType
  }
}

export type UseObjectParameters = { path: string; UISchema?: UISchemaType }

export interface UseObjectProperties {
  (props: UseObjectParameters): UseObjectReturnType
}
