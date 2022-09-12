# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Fix `FormControlProps` to allow `children` on [React 18+](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-typescript-definitions).

## [0.2.0] - 2021-08-03

## [0.2.0-beta.13] - 2020-03-26

### Fixed

- Prevent `onChange` from being triggered during the initial render.

## [0.2.0-beta.12] - 2020-03-20

### Added

- `defaultValues` prop.

### Security

- Upgrade all upgradable dependencies.

## [0.2.0-beta.11] - 2020-02-21

### Fixed

- `getDataFromPath` to `getDataFromPointer` as declared in the `README.md`.

## [0.2.0-beta.10] - 2020-02-21

### Fixed

- Typo in `ErrorTypes`

### Added

- `onChange` and `formProps` props to `FormContext`.

### Changed

- **BREAKING**: no longer uses paths starting with `$` (which was added at version `0.2.0-beta.6`) and all 'paths' should now be relative to the JSON Schema, respecting the [RFC 6901](https://tools.ietf.org/html/rfc6901) which defines the string syntax for JSON Pointers, pay special attention to [section 6](https://tools.ietf.org/html/rfc6901#section-6) which defines the URI frament identifier representation of JSON pointers.

## [0.2.0-beta.9] - 2020-02-18

### Fixed

- `notInEnum` to return expected value in `expected` field of the `ErrorMessage`.

## [0.2.0-beta.8] - 2020-02-17

### Changed

- **BREAKING**: `number` error messages to now return messages describing whether the input does not match the expected pattern for a number.

## [0.2.0-beta.7] - 2020-02-14

### Changed

- **BREAKING**: `onSubmit` now passes an object with `data`, `event` and `methods` as members to the callback.

## [0.2.0-beta.6] - 2020-02-13

### Added

- `$ref` and `$id` resolving in accord to the [JSON Schema specification](https://tools.ietf.org/html/draft-wright-json-schema-01)

### Changed

- **BREAKING**: Now uses paths starting with `$` to represent objects of an instance of the JSON Schema, instead of a path starting with `#`, which resembled a URI fragment identifier representation of a JSON pointer.
- custom validator `context` parameter now gives info as an annotated sub schema

### Fixed

- Not checking if value exists before using enum validation on it
- `isRequired` not evaluating correctly if it is inside another object that is not required
- Empty data not being ignored when parsing form data

## [0.2.0-beta.5] - 2020-02-11

### Added

- `customValidators` to allow the user to define their own validation functions

### Changed

- **BREAKING**: Renamed `FormValuesWithSchema` type to `JSONFormContextValues`

## [0.2.0-beta.4] - 2020-02-05

### Fixed

- Returning non-filled form inputs in the object passed to onSubmit

## [0.2.0-beta.3] - 2020-01-31

### Changed

- **BREAKING**: Changed `InputTypes` and `UITypes` enum values to reflect their enum names and what was documented in the `README`
- **BREAKING**: Changed `min` and `max` props returned from `getInputProps()` to be strings, not numbers
- **BREAKING**: Just re-exports types and `Controller` component from `react-hook-form`

## [0.2.0-beta.2] - 2020-01-30

### Fixed

- type of onChange possibly being undefined

## [0.2.0-beta.1] - 2020-01-29

### Added

- Added `useCheckbox` hook

### Changed

- Changed the BasicInputReturnType to also return a reference to the validator used
- **BREAKING**: The `useObject` hook now automatically associates a boolean to a checkbox

### Fixed

- Fixed returned form data not converting string values that represent booleans to actual booleans

## [0.2.0-beta.0] - 2020-01-23

### Changed

- Renamed `'mode'` prop on FormContext to `'validationMode'`

## [0.2.0-beta] - 2020-01-22

### Added

- Now re-exports the `react-hook-form` public API

## [0.1.3] - 2020-01-21

### Added

- Added test to make sure schema is not modified

### Changed

- Fixed tons of typos on README
- Made README more friendly
- Refactored internal API to be more easily expandable
- Removed complexity from big function bodies

## [0.1.2] - 2020-01-21

### Added

- Typings for JSON Schema object
- Removed unused mock

### Changed

- Add typings for JSON Schema object
- Build process is cleaner
- React hook form is now an external dependency, not bundled with the code anymore

## [0.1.1] - 2020-01-17

### Added

- Initial implementation.
