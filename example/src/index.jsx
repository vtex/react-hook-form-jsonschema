/**
 *  This is just a working example code of how to use the
 *  `react-hook-form-jsonschema`. For the full API read the readme in the root
 *  of the project.
 */

import React, { useState, useReducer } from 'react'
import ReactDOM from 'react-dom'
import {
  useObject,
  FormContext,
  UITypes,
  InputTypes,
} from 'react-hook-form-jsonschema'

const personSchema = {
  $id: 'https://example.com/person.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Person',
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      description: "The person's first name.",
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      description: "The person's last name.",
      title: 'Last Name',
    },
    birthYear: {
      description: "The person's birth year.",
      type: 'integer',
      minimum: 1930,
      maximum: 2010,
      title: 'Birth Year',
    },
  },
}

const UISchema = {
  type: UITypes.default,
  properties: {
    birthYear: {
      type: UITypes.select,
    },
  },
}

function SpecializedObject(props) {
  switch (props.baseObject.type) {
    case InputTypes.input: {
      return (
        <>
          <label {...props.baseObject.getLabelProps()}>
            {props.baseObject.getObject().title}
          </label>
          <input {...props.baseObject.getInputProps()} />
        </>
      )
    }
    case InputTypes.radio: {
      return (
        <>
          <label {...props.baseObject.getLabelProps()}>
            {props.baseObject.getObject().title}
          </label>
          {props.baseObject.getItems().map((value, index) => {
            return (
              <label
                {...props.baseObject.getItemLabelProps(index)}
                key={`${value}${index}`}
              >
                {value}
                <input {...props.baseObject.getItemInputProps(index)} />
              </label>
            )
          })}
        </>
      )
    }
    case InputTypes.select: {
      return (
        <>
          <label {...props.baseObject.getLabelProps()}>
            {props.baseObject.getObject().title}
          </label>
          <select {...props.baseObject.getSelectProps()}>
            {props.baseObject.getItems().map((value, index) => {
              return (
                <option
                  {...props.baseObject.getItemOptionProps(index)}
                  key={`${value}${index}`}
                >
                  {value}
                </option>
              )
            })}
          </select>
        </>
      )
    }
  }
  return <></>
}

function ObjectRenderer(props) {
  const methods = useObject({ path: props.path, UISchema: props.UISchema })

  return (
    <>
      {methods.map(obj => (
        <div key={`${obj.type}${obj.path}`}>
          <SpecializedObject baseObject={obj} />
          {obj.getError() && <p>This is an error!</p>}
        </div>
      ))}
    </>
  )
}

function save(data) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000)
  })
}

const initialState = { loading: false, error: null, success: null }
function reducer(state, action) {
  switch (action.type) {
    case 'START_SAVING': {
      return { loading: true, error: null, success: null }
    }
    case 'SUCCESS_SAVING': {
      return { loading: false, error: false, success: true }
    }
    case 'ERROR_SAVING': {
      return { loading: false, error: true, success: false }
    }
    default:
      return state
  }
}

function RenderMyJSONSchema() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <FormContext
      schema={personSchema}
      onSubmit={({ data }) => {
        dispatch({ type: 'START_SAVING' })
        save(data)
          .then(() => dispatch({ type: 'SUCCESS_SAVING' }))
          .catch(() => dispatch({ type: 'ERROR_SAVING' }))
      }}
    >
      <ObjectRenderer path="$" UISchema={UISchema} />
      <input type="submit" />
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error saving!</p>}
      {state.success && <p>Saved succesfully!</p>}
    </FormContext>
  )
}

ReactDOM.render(<RenderMyJSONSchema />, document.getElementById('root'))
