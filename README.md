# greet

## Description

This Visual Studio Code extension detects linguistic antipatterns in Python source code. Linguistic antipatterns are naming problems in code that lead to inconsistencies, ambiguity, and confusion, making the code harder to understand and maintain. This extension aims to assist developers in identifying and addressing these antipatterns, improving code quality and readability.

## Features

- Detects linguistic antipatterns in Python code.
- Provides real-time feedback and notifications when antipatterns are detected.
- Currently detects the following antipatterns:
  - **Get More Than Accessor**: A getter that performs actions other than returning the corresponding attribute
  - **Not implemented condition**: The comments of a method suggest a conditional behaviour that is not implemented in the code. When the implementation is default this should be documented
  - **Method signature and comment are opposite**: The declaration of a method is in contradiction with its documentation
  - **Attribute signature and comment are opposite**: The
    declaration of an attribute contradicts its documentation.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view and search for "Extension Name".
3. Click on the "Install" button to install the extension.
4. Once installed, the extension will be active and ready to detect linguistic antipatterns in Python code.

## Usage

1. Open a Python file in Visual Studio Code.
2. As you type or modify the code, the extension will analyze it for linguistic antipatterns.
3. If any antipatterns are detected, you will receive real-time feedback through diagnostics.
4. Use the provided suggestions and recommendations to refactor and improve your code.
