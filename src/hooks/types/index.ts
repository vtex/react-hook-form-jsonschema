import React from 'react'

import { ErrorMessage } from '../validators'

export interface UseRadioParameters {
  (path: string): {
    getLabelProps(): React.ComponentProps<'label'>
    getItems(): Array<string>
    getItemInputProps(index: number): React.ComponentProps<'input'>
    getItemLabelProps(index: number): React.ComponentProps<'label'>
    getError(): ErrorMessage
  }
}

export interface UseRawFormParameters {
  (path: string, inputType: string): {
    getLabelProps(): React.ComponentProps<'label'>
    getInputProps(): React.ComponentProps<'input'>
    getName(): string
    getError(): ErrorMessage
  }
}
