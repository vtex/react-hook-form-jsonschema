import React from 'react'
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
    },
    lastName: {
      type: 'string',
      description: "The person's last name.",
    },
    birthYear: {
      description: "The person's birth year.",
      type: 'integer',
      minimum: 1930,
      maximum: 2010,
    },
  },
}

function SpecializedObject(props) {
  switch (props.baseObject.type) {
    case InputTypes.input: {
      return (
        <>
          <label {...props.baseObject.getLabelProps()}>
            {props.baseObject.name}
          </label>
          <input {...props.baseObject.getInputProps()} />
        </>
      )
    }
    case InputTypes.radio: {
      return (
        <>
          <label {...props.baseObject.getLabelProps()}>
            {props.baseObject.name}
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
            {props.baseObject.name}
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

  const objectForm = []
  for (const obj of methods) {
    objectForm.push(
      <div key={`${obj.type}${obj.path}`}>
        <SpecializedObject baseObject={obj} />
        {obj.getError() && <p>This is an error!</p>}
      </div>
    )
  }

  return <>{objectForm}</>
}

function RenderMyJSONSchema() {
  const UISchema = {
    type: UITypes.default,
    properties: {
      birthYear: {
        type: UITypes.select,
      },
    },
  }

  return (
    <FormContext schema={personSchema}>
      {/* <ObjectRenderer path="#" UISchema={UISchema} /> */}
    </FormContext>
  )
}

ReactDOM.render(<RenderMyJSONSchema />, document.getElementById('root'))
