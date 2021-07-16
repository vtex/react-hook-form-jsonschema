import React, { FC } from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { FormContext } from '../../components'
import { useInput } from '../useInput'
import mockTextSchema from '../__mocks__/mockTextSchema'

const Wrapper: FC = ({ children }) => {
  return <FormContext schema={mockTextSchema}>{children}</FormContext>
}

test('useInput type date', () => {
  const { result } = renderHook(() => useInput('#/properties/stringDateTest'), {
    wrapper: Wrapper,
  })

  const { type } = result.current.getInputProps()
  expect(type).toBe('date')
})

test('useInput type date-time', () => {
  const { result } = renderHook(
    () => useInput('#/properties/stringDateTimeTest'),
    {
      wrapper: Wrapper,
    }
  )

  const { type } = result.current.getInputProps()
  expect(type).toBe('datetime-local')
})

test('useInput type email', () => {
  const { result } = renderHook(
    () => useInput('#/properties/stringEmailTest'),
    {
      wrapper: Wrapper,
    }
  )

  const { type } = result.current.getInputProps()
  expect(type).toBe('email')
})

test('useInput type hostname', () => {
  const { result } = renderHook(
    () => useInput('#/properties/stringHostnameTest'),
    {
      wrapper: Wrapper,
    }
  )

  const { type } = result.current.getInputProps()
  expect(type).toBe('url')
})

test('useInput type uri', () => {
  const { result } = renderHook(() => useInput('#/properties/stringUriTest'), {
    wrapper: Wrapper,
  })

  const { type } = result.current.getInputProps()
  expect(type).toBe('url')
})
