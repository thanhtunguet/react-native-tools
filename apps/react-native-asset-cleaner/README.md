react-native-asset-cleaner
==========================

Asset cleaner for React Native

## Installation
```shell
yarn add -D react-native-asset-cleaner
```
or install it globally:
```shell
yarn global add react-native-asset-cleaner
```

## Usage
```shell
Usage: [yarn] asset-cleaner [options] [command]

Asset cleaner for React Native

Options:
  -V, --version              output the version number
  -a, --asset <asset-dir>    Asset folder
  -s, --source <source-dir>  Source folder
  -h, --help                 display help for command
```

## Convention
- Place the asset folder outside of src
- Setup `babel-plugin-module-resolve` to use absolutely import:
  ```tsx
  require('assets/images/test-image.png');
  ```
- Also setup `paths` config for Typescript.
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "assets/*": [
          "./assets/*"
        ]
      }
    }
  }
  ```
