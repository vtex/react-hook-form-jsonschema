# react-hook-form-jsonschema

> Small project based on [react-hook-form](https://github.com/react-hook-form/react-hook-form) that exposes an API for easily creating customizable forms based on a [JSON Schema](https://json-schema.org/understanding-json-schema/index.html) with built-in validation.

`react-hook-form-jsonschema` is a React hooks library that manages all the stateful logic needed to make a functional form based on a JSON Schema. It returns a set of props that are meant to be called and their results destructured on the desired input field.

Try a live demo on [CodeSandbox](https://codesandbox.io/s/react-hook-form-jsonschema-basic-example-u68o7)!

[Supported JSON Schema keywords](#supported-json-schema-keywords)

## Table of Contents

- [react-hook-form-jsonschema](#react-hook-form-jsonschema)
  - [Table of Contents](#table-of-contents)
  - [Simple Usage](#simple-usage)
  - [Installation](#installation)
  - [API](#api)
  - [Components API](#components-api)
    - [FormContext component API](#formcontext-component-api)
  - [Functions API](#functions-api)
    - [getDataFromPointer(pointer, data)](#getdatafrompointerpointer-data)
  - [Hooks API](#hooks-api)
    - [useCheckbox(pointer)](#usecheckboxpointer)
    - [useHidden(pointer)](#usehiddenpointer)
    - [useInput(pointer)](#useinputpointer)
    - [useObject(pointer, UISchema)](#useobjectpointer-uischema)
    - [usePassword(pointer)](#usepasswordpointer)
    - [useRadio(pointer)](#useradiopointer)
    - [useSelect(pointer)](#useselectpointer)
    - [useTextArea(pointer)](#usetextareapointer)
  - [Supported JSON Schema keywords](#supported-json-schema-keywords)
  - [TODO/Next Steps](#todonext-steps)
  - [Useful resources](#useful-resources)

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

And suppose you want to create a form field for the `firstName` field, simply use the `useInput()` hook and render the form using react:

```JSX
function FirstNameField(props) {
  const inputMethods = useInput('#/properties/firstName');

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

## API

This is the API documentation, `react-hook-form-jsonschema` also re-exports all the [`react-hook-form`](https://github.com/react-hook-form/react-hook-form) types and the `Controller` component. All of the other functionalities are abstracted by this library.

## Components API

### FormContext component API

This component is the top-level component that creates the context with the schema and options all the hooks will need to be usable. So bear in mind that you **need** to define all the other components as children of `FormContext`.

#### props:

##### Required:

- `schema`: JSON Schema object which will be passed down by context for the inputs to use it for validation and the structure of the form itself.

##### Optional:

- `customValidators`: An object where each member has to be a funtion with the following format:
  - `function(value: string, context: SubSchemaInfo) => CustomValidatorReturnValue`
  - `params`:
    - `value`: Is the current value in the form input.
    - `context`: Is an object with the following fields:
      - `JSONSchema`: Is the sub schema of the current field
      - `isRequired`: Whether the current field is required or not
      - `objectName`: The name of the sub schema
      - `invalidPointer`: A `boolean` indicating whether the referenced field was found within the schema or not. If it is false it is because of an error in the schema.
      - `pointer`: JSON Pointer to sub schema that should be validated. The pointer is always in the form: `#/properties/some/properties/data` where `#` represents the root of the schema, and the `properties/some/properties/data` represents the tree of objects (from `some` to `data`) to get to the desired field, which in this case is `data`. Also see the definition of JSON Pointers on [RFC 6901](https://tools.ietf.org/html/rfc6901).
  - `return value`: Must be either a `string` that identifies the error or a `true` value indicating the validation was succesfull.
- `formProps`: An object that is passed to the underlying `<form>` element. Accepts the same attributes as when declaring a `<form>` with React, except `onSubmit`.
- `validationMode`: String to indicate when to validate the input, default is `'onSubmit'`.
  - `'onBlur'`: Validate when an input field is blurred.
  - `'onChange'`: Validate when an input field value changes.
  - `'onSubmit'`: Validate when the submit is triggered.
- `revalidateMode`: String to indicate when inputs with errors get re-validated, default is `'onChange'`.
  - `'onblur'`: Validate when an input field is blurred.
  - `'onChange'`: Validate when an input field value changes.
  - `'onSubmit'`: Validate when the submit is triggered.
- `submitFocusError`: Boolean, when `true` focus on the first field with error after submit validates, if there is any. Defaults to `true`.
- `onChange`: Callback called when there's a change in the form. It passes the form *data* formatted by the provided JSON Schema.
- `onSubmit`: If provided `react-hook-form-jsonschema` will call this function as the submit action, it passes an object with the following members:
  - `data`: The data that was provided as inputs to the form, correctly formatted as an instance of the JSON Schema provided.
  - `event`: A react event
  - `methods`: Provides access to the methods of [`react-hook-form`](https://react-hook-form.com/api) `useForm`, from this you can extract, for example, the `triggerValidation` method to revalidate the form if an error occured while submitting.
- `noNativeValidate`: Boolean, when `true` disables the default browser validation (notice that `react-hook-form-jsonschema` does NOT yet implement validation for URIs and email addresses).

## Functions API

### getDataFromPointer(pointer, data)

**Description**

Gets a specific member of data given a pointer.

**Parameters**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.
- `data`: An object, as the one passed as parameter to the `onSubmit` function.

**Return**

Returns the data indicated by the pointer inside an instance of a JSON Schema the object. Or undefined if the pointer is not found.

**Example**

```JSX
// Suppose you have a schema with the following format:
const schema = {
  type: 'object',
  properties: {
    address: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    }
  }
}

// A valid instance of this schema is this:
const data = {
  address: {
    name: "Foo"
  }
}

// And suppose you have a pointer to a sub schema only:
const pointer = '#/properties/address/properties/name'

// Use this function to get the data from the instance of the schema(data) that
// coincides with the sub schema the pointer points to.
const result = getDataFromPointer(pointer, data) // returns "Foo"
```

## Hooks API

The following are the common fields returned in the object from every `use'SomeInputType'` hook:

- `type`: The type of the input, as defined in **`InputTypes`**:
  - `generic`: the default type, a non specialized type, only contains the common fields
  - `radio`: Type used for `<input type='radio' \>`
  - `select`: Type used for `<select>`
  - `input`: Type used for generic `<input \>`
  - `textArea`: Type used for `<textarea>`
  - `checkbox`: Type used for `<input type='checkbox' \>`
- `pointer`: JSON Pointer to sub schema that should be validated. The pointer is always in the form: `#/properties/some/properties/data` where `#` represents the root of the schema, and the `properties/some/properties/data` represents the tree of objects (from `some` to `data`) to get to the desired field, which in this case is `data`. Also see the definition of JSON Pointers on [RFC 6901](https://tools.ietf.org/html/rfc6901).
- `name`: The last object/data field name in the tree. In the case of the JSONSchema pointer `#/properties/child/properties/here` the name value will be `here`.
- `isRequired`: indicates whether the field is required or not.
- `validator`: is the object passed to `react-hook-form` to validate the form. See the [`react-hook-form`](https://github.com/react-hook-form/react-hook-form) for more information
- `formContext`: If you want to access internal `react-hook-form` context use this
- `getError()`: Returns an `ErrorMessage`, which has the following format:
  - `{message: ErrorTypes, expected: ErrorMessageValues}`
  - **`ErrorTypes`**, is an enum, with the following values:
    - `required`: the field is required to be filled
    - `maxLength`: maximum length of string input was surpassed
    - `minLength`: minimum length of string input was not met
    - `maxValue`: maximum value of number input was surpassed
    - `minValue`: minimum value of number input was not met
    - `pattern`: the pattern or type defined in the schema was not met
    - `notInteger`: the input was expected to be an integer but is not
    - `notFloat`: the input was expected to be a float but is not
    - `multipleOf`: the number is not a multiple of the number defined in the schema
    - `notInEnum`: the input does not match any of the expected values defined in the `enum` option in the schema
    - `undefinedError`: the error type could not be defined
  - **`ErrorMessageValues`**, is the expected value to be met, it will be `true` for required, and the minimum value expected for `minValue` for example.
- `getObject()`: Returns the data field in the schema that this input refers to

**Please notice that in all of the following examples it is assumed the components are already children of a `FormContext` component**

### useCheckbox(pointer)

**Description**

Use this hook to build a single or multiple checkbox field in your form.

**Parameters:**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.

**Return:**

Returns an object with the following fields, besides the common one's:

- `isSingle`: indicates whether there is just a single option inside the checkbox
- `getItems()`: use this to get which values should be listed inside the radio input fields. This function derives the items by the defined type and properties inside the JSON Schema and returns all the required items to comply with the definition.
- `getItemInputProps(index)`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it for the item in the specified index from `getItems()`
- `getItemLabelProps(index)`: the label props related to the input at the specified index from `getItems()`

**Example:**

```JSX
function InputField(props) {
  const inputMethods = useCheckbox(props.pointer)

  return (
    <React.Fragment>
      {inputMethods.getItems().map((value, index) => {
        return (
          <label {...inputMethods.getItemLabelProps(index)} key={`${value}${index}`}>
            {inputMethods.isSingle ? inputMethods.getObject().title : value}
            <input {...inputMethods.getItemInputProps(index)} />
          </label>
        )
      })}
      {inputMethods.getError() && <p>This is an error!</p>}
    </React.Fragment>
  )
}
```

### useHidden(pointer)

**Description**

Use this hook to build a hidden field in the form, the user will not be able to change it or see it, but it will be there when submitted.

**Parameters:**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.

**Return:**

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated input (the `for` property) with it.
- `getInputProps()`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it

**Example:**

```JSX
function HiddenField(props) {
  const inputMethods = useHidden('#/properties/Foo');

  return (
    <React.Fragment>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <input {...inputMethods.getInputProps()} />
    </React.Fragment>
  )
}
```

### useInput(pointer)

**Description**

Use this hook to build a generic input field in your form, with validation based on the type of input the JSON Schema requires.

**Parameters:**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.

**Return:**

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated input (the `for` property) with it.
- `getInputProps()`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it.

**Example:**

```JSX
function InputField(props) {
  const inputMethods = useInput('#/properties/Foo');

  return (
    <React.Fragment>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <input {...inputMethods.getInputProps()} />
    </React.Fragment>
  )
}
```

### useObject(pointer, UISchema)

**Description**

This hook works a little differently than the others. `useObject` returns an array of which each of its elements corresponds to the return type of one of the other hooks.

**Parameters:**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.
- `UISchema` (Optional): This UISchema is a modified schema type, relative to the sub schema passed in the `pointer` prop, the format of the UISchema is the following:

```js
const UISchema = {
  /*
   *  This is the type that will be used to choose what type of input will be
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
  - `checkbox`: input will be of the checkbox type, just as returned by the `useCheckbox` hook

**Return:**

Returns an array, with each element being the return of a different call to a hook for each child of the object that was passed in the pointer.

**Example:**

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
        <React.Fragment>
          <label {...props.baseObject.getLabelProps()}>
            {props.baseObject.name}
          </label>
          <input {...props.baseObject.getInputProps()} />
        </React.Fragment>
      )
    }
    case InputTypes.radio: {
      return (
        <React.Fragment>
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
        </React.Fragment>
      )
    }
    case InputTypes.select: {
      return (
        <React.Fragment>
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
        </React.Fragment>
      )
    }
  }
  return <React.Fragment></React.Fragment>
}

function ObjectRenderer(props) {
  const inputMethods = useObject({ pointer: props.pointer, UISchema: props.UISchema })

  const objectForm = []

  // Note that we also add error checking here and show a message in case there
  // is one. Remember that you can also check for the type of error returned
  // anb give a more specialized warning to the user.
  for (const obj of inputMethods) {
    objectForm.push(
      <div key={`${obj.type}${obj.pointer}`}>
        <SpecializedObject baseObject={obj} />
        {obj.getError() && <p>This is an error!</p>}
      </div>
    )
  }

  return <React.Fragment>{objectForm}</React.Fragment>
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
      <ObjectRenderer pointer="#" UISchema={UISchema} />
    </FormContext>
  )
}
```

This is the result of this example:

<img src="https://user-images.githubusercontent.com/19346539/72556402-48b35080-387d-11ea-92a0-8b5914462603.png" alt="useObject Example" width="200"/>

### usePassword(pointer)

**Description**

Use this hook to build a password input field in your form, with validation based on the type of input the JSON Schema requires.

**Parameters:**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.

**Return:**

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated input (the `for` property) with it.
- `getInputProps()`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it

**Example:**

```JSX
function PasswordField(props) {
  const inputMethods = usePassword('#/properties/Foo');

  return (
    <React.Fragment>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <input {...inputMethods.getInputProps()} />
    </React.Fragment>
  )
}
```

### useRadio(pointer)

**Description**

Use this hook to build a radio field in your form.

**Parameters:**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.

**Return:**

Returns an object with the following fields, besides the common one's:

- `getItems()`: use this to get which values should be listed inside the radio input fields. This function derives the items by the defined type and properties inside the JSON Schema and returns all the required items to comply with the definition.
- `getItemInputProps(index)`: use this with the spread operator inside an `<input>` tag and get the benefit of the validator, id field, name and an associated label with it for the item in the specified index from `getItems()`
- `getItemLabelProps(index)`: the label props related to the input at the specified index from `getItems()`

**Example:**

```JSX
function InputField(props) {
  const inputMethods = useRadio('#/properties/Foo');

  return (
    <React.Fragment>
      {inputMethods.getItems().map((value, index) => {
        return (
          <label {...inputMethods.getItemLabelProps(index)} key={`${value}${index}`}>
            {value}
            <input {...inputMethods.getItemInputProps(index)} />
          </label>
        )
      })}
      {inputMethods.getError() && <p>This is an error!</p>}
    </React.Fragment>
  )
}
```

### useSelect(pointer)

**Description**

Use this hook to build a select field in your form.

**Parameters:**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.

**Return:**

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated select (the `for` property) with it.
- `getItems()`: use this to get all the values that are possible to be in the radio buttons
- `getItemOptionProps(index)`: use this with the spread operator inside an `<option>` tag and get the benefit of the validator, id field and name for the item in the specified index from `getItems()`
- `getSelectProps()`: use this with the spread operator inside a `<select>` tag to get validation and register it with the react-hook-form-jsonschema.

**Example:**

```JSX
function InputField(props) {
  const inputMethods = useSelect('#/properties/Foo');

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
```

### useTextArea(pointer)

**Description**

Use this hook to build a textarea field in the form.

**Parameters:**

- `pointer`: JSON Pointer to the desired sub schema that will be rendered.

**Return:**

Returns an object with the following fields, besides the common one's:

- `getLabelProps()`: use this with the spread operator inside a `<label>` tag and get the benefit of having all the important fields of the label filled in for you and the associated input (the `for` property) with it.
- `getTextAreaProps()`: use this with the spread operator inside an `<textarea>` tag and get the benefit of the validator, id field, name and an associated label with it

**Example:**

```JSX
function HiddenField(props) {
  const inputMethods = useTextArea('#/properties/Foo');

  return (
    <React.Fragment>
      <label {...inputMethods.getLabelProps()}>
        {inputMethods.name}
      </label>
      <textarea {...inputMethods.getTextAreaProps()} />
    </React.Fragment>
  )
}
```

## Supported JSON Schema keywords

- `multipleOf`
- `maximum`
- `exclusiveMaximum`
- `minimum`
- `exclusiveMinimum`
- `maxLength`
- `minLength`
- `pattern`
- `items` (does not support an array of schemas)
- `maxItems` (for this one and `minItems` they are missing specific error messages)
- `minItems`
- `required`
- `enum`
- `type` (does not support array of types)
- `properties`
- `$id`
- `$ref`

Does not support fetching a JSON Schema from an URI (as per the draft this is optional).

## TODO/Next Steps

- [ ] Improve array type support(and it's validation).
- [ ] Implement `dependencies` keyword for dynamic formularies.
- [ ] Implement `allOf`, `anyOf`, `oneOf` and `not` for more liberty in creating form schemas.
- [ ] Implement built-in validation of `format` keyword for all possible formats.
- [ ] Maybe? Implement new input types for each, or similar, formats, like an `useDate` for format `date-time`
- [ ] Implement `default` values.
- [ ] Implement `const` keyword.
- [ ] Warn user that there is an error in the schema if any of the keywords fails to validate against the expected type and format.
- [x] Change paths (usage of \$) to JSON Scchema pointers (usage of #) so it does not create and overhead and confusion between the two.

## Useful resources

- [JSON Schema Draft 6 Core](https://tools.ietf.org/html/draft-wright-json-schema-01): Draft of the core JSONSchema, essential for implementing any new feature in the library
- [JSON Schema Draft 6 Validation](https://tools.ietf.org/html/draft-wright-json-schema-validation-01): Describes the schema keywords with how they shoul be handled, what they do, and how to validate against them, essential for implementing any new keyword
- [RFC 6901](https://tools.ietf.org/html/rfc6901): RFC of JSON Pointers.
- [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/index.html) (Beware this is for Draft 7, but it is still a pretty good reference)
- [JSON Schema Website](https://json-schema.org/)
