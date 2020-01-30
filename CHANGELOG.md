# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- `InputTypes` and `UITypes` enum values to reflect their enum names and what was documented in the `README`

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
