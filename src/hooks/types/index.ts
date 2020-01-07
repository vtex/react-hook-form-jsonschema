import React from 'react'

export interface UseRadioParameters {
  (path: string): {
    getLabelProps(): React.ComponentProps<'label'>
    getItems(): Array<string>
    getItemProps(index: number): React.ComponentProps<'input'>
  }
}
