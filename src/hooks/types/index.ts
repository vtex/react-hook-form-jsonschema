import React from 'react'

import { ErrorMessage } from '../validators'
import { JSONSchemaType } from '../../JSONSchema'

export interface BasicInputReturnType {
  getLabelProps(): React.ComponentProps<'label'>
  getName(): string
  getError(): ErrorMessage
}

export interface UseRadioReturnType extends BasicInputReturnType {
  getItems(): Array<string>
  getItemInputProps(index: number): React.ComponentProps<'input'>
  getItemLabelProps(index: number): React.ComponentProps<'label'>
}

export interface UseRadioParameters {
  (path: string): UseRadioReturnType
}

export interface UseSelectReturnType extends BasicInputReturnType {
  getItemOptionProps(index: number): React.ComponentProps<'option'>
  getItems(): Array<string>
  getLabelProps(): React.ComponentProps<'label'>
  getSelectProps(): React.ComponentProps<'select'>
}

export interface UseSelectParameters {
  (path: string): UseSelectReturnType
}

export interface UseRawInputReturnType extends BasicInputReturnType {
  getInputProps(): React.ComponentProps<'input'>
}

export interface UseRawInputParameters {
  (
    path: string,
    inputType: string,
    currentObject: JSONSchemaType,
    isRequired: boolean,
    currentName: string
  ): UseRawInputReturnType
}

export interface UseInputParameters {
  (path: string): UseRawInputReturnType
}

export interface UseTextAreaReturnType extends BasicInputReturnType {
  getTextAreaProps(): React.ComponentProps<'textarea'>
}

export interface UseTextAreaParameters {
  (path: string): UseTextAreaReturnType
}
