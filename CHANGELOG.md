# Change Log

All notable changes to the "greet" extension will be documented in this file.

## Next Release

- Detection of another type of linguistic antipatterns in Python code named "Get more then accessor": a getter that performs actions other than returning the corresponding attribute.

## 1.0.0 - 2023-06-02

### Added

- Detection of three types of linguistic antipatterns in Python code:
  - Not implemented condition: The comments of a method suggest a conditional behaviour that is not implemented in the code. When the - implementation is default this should be documented
  - Method signature and comment are opposite: The declaration of a method is in contradiction with its documentation
  - Attribute signature and comment are opposite: The declaration of an attribute contradicts its documentation
