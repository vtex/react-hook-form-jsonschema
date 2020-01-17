# react-hook-form-jsonschema

> Small project based on [react-hook-form](https://github.com/react-hook-form/react-hook-form) that exposes an API for easily creating customizable forms based on a [JSON Schema](https://json-schema.org/understanding-json-schema/index.html) with built-in validation.

## Table of Contents

- [react-hook-form-jsonschema](#react-hook-form-jsonschema)
  - [Simple Usage](#simple-usage)
  - [Installation](#installation)
  - [Components API](#components-api)
    - [FormContext component](#formcontext-component)
  - [Hooks API](#hooks-api)
    - [useHidden(path)](#usehiddenpath)
    - [useInput(path)](#useinputpath)
    - [useObject(path, UISchema)](#useobjectpath-uischema)
    - [usePassword(path)](#usepasswordpath)
    - [useRadio(path)](#useradiopath)
    - [useSelect(path)](#useselectpath)
    - [useTextArea(path)](#usetextareapath)

## Simple Usage

Suppose you have a simple JSON Schema that stores a person's first name:

```js
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
  },
}
```

And suppose you want to create a form field for the firstName field, simply use the useInput() hook for this and then render the form using react

```JSX
function FirstNameField(props) {
  const inputMethods = useInput('#/firstName');

  return (
    <FormContext schema={personSchema}>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <input {...inputMethods.getInputProps()} />
    </FormContext>
  )
}
```

## Installation

With npm:

```
npm install react-hook-form-jsonschema --save
```

Or with yarn:

```
yarn add react-hook-form-jsonschema
```

## Components API

### FormContext component

#### props:

##### Required:

- `schema`: JSON Schema object which will be passed down by context for the inputs to use it for validation and the structure of the form itself.

##### Optional:

- `mode`: String to indicate when to validate the input, default is `'onSubmit'`.
  - `'onBlur'`: Validate when an input field is blurred
  - `'onChange'`: Validate when an input field value changes
  - `'onSubmit'`: Validate when the submit is triggered
- `revalidateMode`: String to indicate when inputs with errors get re-validated, default is `'onChange'`.
  - `'onblur'`: Validate when an input field is blurred
  - `'onChange'`: Validate when an input field value changes
  - `'onSubmit'`: Validate when the submit is triggered
- `submitFocusError`: Boolean, when `true` focus on the first field with error after submit validates, if there is any. Defaults to `true`.
- `onSubmit`: Callback function that the form values are passed to when submit is triggered
- `noNativeValidate`: Boolean, when `true` disables the default browser validation (notice that react-hook-form-jsonschema does NOT yet implement validation form URIs and email addresses).

## Hooks API

The following are the common fields returned in the object from every `use'SomeInputType'` hook:

- `type`: The type of the input, as defined in **`InputTypes`**:
  - `generic`: the default type, a non specialized type, only contains the common fields
  - `radio`: Type used for `<input type='radio' \>`
  - `select`: Type used for `<select>`
  - `input`: Type used for generic `<input \>`
  - `textArea`: Type used for `<textarea>`
- `path`: Path in the jsonschema this input is validated against. The path is always in the form: `#/some/child/data/field/here` where `#` represents the root of the schema, and the `some/child/data/field/here` represents the tree of objects (from `some` to `here`) to get to the desired field, which in this case is `here`.
- `name`: The last object/data field name in the tree. In the case of `#/some/child/data/field/here` the name value will be `here`.
- `isRequired`: indicates wether the field is required or not.
- `formContext`: If you want to access internal react-hook-form context use this
- `getError()`: Returns an `ErrorMessage`, which has the following format:
  - `{message: ErrorTypes, expected: ErrorMessageValues}`
  - **`ErrorTypes`**, is an enum, with the following values:
    - `required`: the field is required to be filled
    - `maxLength`: maximum lenght of string input was surpassed
    - `minLength`: minimum lenght of string input was not met
    - `maxValue`: maximum value of number input was surpassed
    - `minValue`: minimum value of number input was not met
    - `pattern`: the pattern or type defined in the schema was not met
    - `multipleOf`: the number is not a multiple of the number defined in the schema
    - `undefinedError`: the error type could not be defined
  - **`ErrorMessageValues`**, is the expected value to be met, it will be `true` for required, and the minimum value expected for `minValue` for example.
- `getObject()`: Returns the data field in the schema that this input refers to

### useHidden(path)

##### Description

Use this hook to build a hidden field in the form, the user will not be able to change it or see it, but it will be there when submitted.

##### Parameters:

- `path`: String which represents the path to the data field of the JSON Schema that this input will be built for.

##### Return:

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated input (the `for` property) with it.
- `getInputProps()`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it

##### Example:

```JSX
function HiddenField(props) {
  const inputMethods = useHidden('#/some/child/you/want/hidden');

  return (
    <FormContext schema={personSchema}>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <input {...inputMethods.getInputProps()} />
    </FormContext>
  )
}
```

### useInput(path)

##### Description

Use this hook to build a generic input field in your form, with validation based on the type of input the JSON Schema requires.

##### Parameters:

- `path`: String which represents the path to the data field of the JSON Schema that this input will be built for.

##### Return:

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated input (the `for` property) with it.
- `getInputProps()`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it.

##### Example:

```JSX
function InputField(props) {
  const inputMethods = useInput('#/some/child/you/want/as/input');

  return (
    <FormContext schema={personSchema}>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <input {...inputMethods.getInputProps()} />
    </FormContext>
  )
}
```

### useObject(path, UISchema)

##### Description

This hook works a little differently than the others. This hook will return an array of which each of its elements corresponds to the return type of one of the other hooks.

##### Parameters:

- `path`: String which represents the path to the data field of the JSON Schema that this input will be built for.
- `UISchema` (Optional): This UISchema is a modified schema type, relative to the object passed in the `path` prop, the format of the UISchema is the following:

```js
const UISchema = {
  /* This is the type that will be used to choose what type of input will be
   *  used to build the specified field. Please note that the type of a node
   *  that is an object will be ignored, as there would make no sense to render
   *  an object without it's children inside a form.
   */
  type: UITypes,
  properties: {
    // Note that the definition is recursive
    child1NameHere: UISchema,
    child2NameHere: UISchema,
    // ...
    childXNameHere: UISchema,
  },
}
```

- The **`UITypes`** is an enum with the following values:
  - `default`: input will have a default type based on what react-hook-form-jsonschema thinks is better.
  - `radio`: input will be of the radio type, just as returned by the `useRadio` hook
  - `select`: input will be of the select type, just as returned by the `useSelect` hook
  - `input`: input will be of the input type, just as returned by the `useInput` hook
  - `hidden`: input will be of the hidden type, just as returned by the `useHidden` hook
  - `password`: input will be of the password type, just as returned by the `usePassword` hook
  - `textArea`: input will be of the textarea type, just as returned by the `useTextArea` hook

##### Return:

Returns an array, with each element being the return of a different call to a hook for each child of the object that was passed in the path

##### Example:

```JSX
const personSchema = {
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
  const inputMethods = useObject({ path: props.path, UISchema: props.UISchema })

  const objectForm = []
  for (const obj of inputMethods) {
    objectForm.push(
      <div key={`${obj.type}${obj.path}`}>
        <SpecializedObject baseObject={obj} />
        // This is the simplest way to check if there was an error, but
        // remember that you can still check the error message to
        // specialize the kind of information you give to your
        // user.
        {obj.getError() && <p>This is an error!</p>}
      </div>
    )
  }

  return <>{objectForm}</>
}

function RenderMyJSONSchema() {
  // Notice that even though only one child was specified, all the children of
  // the root object are rendered, using the choosen default for each field.
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
      <ObjectRenderer path="#" UISchema={UISchema} />
    </FormContext>
  )
}
```

This is the result of this example:

<img src="https://user-images.githubusercontent.com/19346539/72556402-48b35080-387d-11ea-92a0-8b5914462603.png" alt="useObject Example" width="200"/>

### usePassword(path)

##### Description

Use this hook to build a password input field in your form, with validation based on the type of input the JSON Schema requires.

##### Parameters:

- `path`: String which represents the path to the data field of the JSON Schema that this input will be built for.

##### Return:

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated input (the `for` property) with it.
- `getInputProps()`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it

##### Example:

```JSX
function PasswordField(props) {
  const inputMethods = usePassword('#/some/child/you/want/as/input');

  return (
    <FormContext schema={personSchema}>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <input {...inputMethods.getInputProps()} />
    </FormContext>
  )
}
```

### useRadio(path)

##### Description

Use this hook to build a radio field in your form.

##### Parameters:

- `path`: String which represents the path to the data field of the JSON Schema that this input will be built for.

##### Return:

Returns an object with the following fields, besides the common one's:

- `getItems()`: use this to get all the values that are possible to be in the radio buttons
- `getItemInputProps(index)`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it for the item in the specified index from `getItems()`
- `getItemLabelProps(index)`: the label props related to the input at the specified index from `getItems()`

##### Example:

```JSX
function InputField(props) {
  const inputMethods = useRadio('#/some/child/with/limited/possible/values');

  return (
    <FormContext schema={personSchema}>
      {inputMethods.getItems().map((value, index) => {
        return (
          <label {...inputMethods.getItemLabelProps(index)} key={`${value}${index}`}>
            {value}
            <input {...inputMethods.getItemInputProps(index)} />
          </label>
        )
      })}
      {inputMethods.getError() && <p>This is an error!</p>}
    </FormContext>
  )
}
```

### useSelect(path)

##### Description

Use this hook to build a select field in your form.

##### Parameters:

- `path`: String which represents the path to the data field of the JSON Schema that this input will be built for.

##### Return:

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated select (the `for` property) with it.
- `getItems()`: use this to get all the values that are possible to be in the radio buttons
- `getItemOptionProps(index)`: use this with the spread operator inside an `<option>` tag and get the benefit of the validator, id field and name for the item in the specified index from `getItems()`
- `getSelectProps()`: use this with the spread operator inside a `<select>` tag to get validation and register it with the react-hook-form-jsonschema.

##### Example:

```JSX
function InputField(props) {
  const inputMethods = useSelect('#/some/child/with/limited/possible/values');

  return (
    <FormContext schema={personSchema}>
      <label {...inputMethods.getLabelProps()}>{inputMethods.name}</label>
      <select {...inputMethods.getSelectProps()}>
        {inputMethods.getItems().map((value, index) => {
          return (
            <option
              {...inputMethods.getItemOptionProps(index)}
              key={`${value}${index}`}
            >
              {value}
            </option>
          )
        })}
      </select>
      {inputMethods.getError() && <p>This is an error!</p>}
    </FormContext>
  )
}
```

### useTextArea(path)

##### Description

Use this hook to build a textarea field in the form.

##### Parameters:

- `path`: String which represents the path to the data field of the JSON Schema that this input will be built for.

##### Return:

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated input (the `for` property) with it.
- `getTextAreaProps()`: use this with the spread operator inside an `<textarea>` tag and get the benefit of the validator, id field, name and an associated label with it

##### Example:

```JSX
function HiddenField(props) {
  const inputMethods = useTextArea('#/some/child/you/want/as/TextArea');

  return (
    <FormContext schema={personSchema}>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <textarea {...inputMethods.getTextAreaProps()} />
    </FormContext>
  )
}
```
