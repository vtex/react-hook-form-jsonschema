import React from 'react'

export interface UseRadioParameters {
  (path: string): {
    getLabelProps(): React.ComponentProps<'label'>
    getItems(): Array<string>
    getItemInputProps(index: number): React.ComponentProps<'input'>
    getItemLabelProps(index: number): React.ComponentProps<'label'>
    getError():
      | {
          message: string | undefined
        }
      | undefined
  }
}
