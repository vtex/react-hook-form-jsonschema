import React, { FC } from 'react'
import { render, wait, fireEvent } from '@vtex/test-tools/react'

import { useInput } from '../../useInput'
import { FormContext } from '../../../components'
import { ErrorTypes } from '../types'
import mockSchema from '../../__mocks__/mockSchema'

const MockInput: FC<{ path: string }> = props => {
  const methods = useInput(props.path)
  const error = methods.getError()

  return (
    <>
      <label {...methods.getLabelProps()}>
        {methods.getObject().title}
        <input {...methods.getInputProps()} />
      </label>
      {error && (
        <p>
          This is an error: {`${error.message}:${error.expected?.toString()}`}
        </p>
      )}
    </>
  )
}

test('should raise error when writing value not in enum', async () => {
  const { getByText, getByLabelText } = render(
    <FormContext
      schema={mockSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockInput path="$/stringTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )
  fireEvent.change(getByLabelText('test-useSelectString'), {
    target: { value: 'some value not in the enum' },
  })
  getByText('Submit').click()

  await wait(() =>
    expect(
      getByText(
        `This is an error: ${ErrorTypes.notInEnum}:this,tests,the,useSelect,hook`
      )
    ).toBeDefined()
  )
})

describe('testing integer boundaries', () => {
  it('should raise error for maximum', async () => {
    const { getByText, getByLabelText } = render(
      <FormContext
        schema={mockSchema}
        onSubmit={() => {
          return
        }}
        noNativeValidate
      >
        <MockInput path="$/integerTest" />
        <input type="submit" value="Submit" />
      </FormContext>
    )

    fireEvent.change(getByLabelText('test-useSelectInteger'), {
      target: { value: 12 },
    })
    getByText('Submit').click()

    await wait(() =>
      expect(
        getByText(`This is an error: ${ErrorTypes.maxValue}:6`)
      ).toBeDefined()
    )
  })

  it('should raise error for minimum', async () => {
    const { getByText, getByLabelText } = render(
      <FormContext
        schema={mockSchema}
        onSubmit={() => {
          return
        }}
        noNativeValidate
      >
        <MockInput path="$/integerTest" />
        <input type="submit" value="Submit" />
      </FormContext>
    )

    fireEvent.change(getByLabelText('test-useSelectInteger'), {
      target: { value: -12 },
    })
    getByText('Submit').click()

    await wait(() =>
      expect(
        getByText(`This is an error: ${ErrorTypes.minValue}:0`)
      ).toBeDefined()
    )
  })

  it('should raise error for multipleOf', async () => {
    const { getByText, getByLabelText } = render(
      <FormContext
        schema={mockSchema}
        onSubmit={() => {
          return
        }}
        noNativeValidate
      >
        <MockInput path="$/integerTest" />
        <input type="submit" value="Submit" />
      </FormContext>
    )

    fireEvent.change(getByLabelText('test-useSelectInteger'), {
      target: { value: 5 },
    })
    getByText('Submit').click()

    await wait(() =>
      expect(
        getByText(`This is an error: ${ErrorTypes.multipleOf}:2`)
      ).toBeDefined()
    )
  })

  it('should raise error for notInteger', async () => {
    const { getByText, getByLabelText } = render(
      <FormContext
        schema={mockSchema}
        onSubmit={() => {
          return
        }}
        noNativeValidate
      >
        <MockInput path="$/integerTest" />
        <input type="submit" value="Submit" />
      </FormContext>
    )

    fireEvent.change(getByLabelText('test-useSelectInteger'), {
      target: { value: 2.2 },
    })
    getByText('Submit').click()

    await wait(() =>
      expect(
        getByText(`This is an error: ${ErrorTypes.notInteger}:undefined`)
      ).toBeDefined()
    )
  })
})

describe('testing float boundaries', () => {
  it('should raise error for maximum', async () => {
    const { getByText, getByLabelText } = render(
      <FormContext
        schema={mockSchema}
        onSubmit={() => {
          return
        }}
        noNativeValidate
      >
        <MockInput path="$/numberTest" />
        <input type="submit" value="Submit" />
      </FormContext>
    )

    fireEvent.change(getByLabelText('test-useSelectNumber'), {
      target: { value: 12 },
    })
    getByText('Submit').click()

    await wait(() =>
      expect(
        getByText(`This is an error: ${ErrorTypes.maxValue}:0.5`)
      ).toBeDefined()
    )
  })

  it('should raise error for minimum', async () => {
    const { getByText, getByLabelText } = render(
      <FormContext
        schema={mockSchema}
        onSubmit={() => {
          return
        }}
        noNativeValidate
      >
        <MockInput path="$/numberTest" />
        <input type="submit" value="Submit" />
      </FormContext>
    )

    fireEvent.change(getByLabelText('test-useSelectNumber'), {
      target: { value: -12 },
    })
    getByText('Submit').click()

    await wait(() =>
      expect(
        getByText(`This is an error: ${ErrorTypes.minValue}:0`)
      ).toBeDefined()
    )
  })
})

test('should raise required error', async () => {
  const { getByText } = render(
    <FormContext
      schema={mockSchema}
      onSubmit={() => {
        return
      }}
    >
      <MockInput path="$/errorTest" />
      <input type="submit" value="Submit" />
    </FormContext>
  )

  getByText('Submit').click()

  await wait(() =>
    expect(
      getByText(`This is an error: ${ErrorTypes.required}:true`)
    ).toBeDefined()
  )
})
