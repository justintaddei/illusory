# illusory <!-- omit in toc -->

![GitHub build status](https://img.shields.io/github/workflow/status/justintaddei/illusory/Tests/master?logo=github)
![Open issues](https://img.shields.io/github/issues-raw/justintaddei/illusory.svg?style=flat)
![npm version](https://img.shields.io/npm/v/illusory.svg?style=flat)
![downloads](https://img.shields.io/npm/dt/illusory.svg?style=flat&label=npm+installs)
![license](https://img.shields.io/npm/l/illusory.svg?style=flat)
![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)
![language](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)
![Status](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

Seamlessly morph one element into another.  
[**Demo**](https://justintaddei.github.io/illusory/)

## Installation

```html
<!-- For IE support -->
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>

<script src="https://unpkg.com/illusory"></script>

<script>
  illusory(from, to)
</script>
```

### or <!-- omit in toc -->

```sh
$ npm install illusory
```

```js
import { illusory } from 'illusory'
```


## Basic usage

```js
illusory(from, to)
```


## Documentation

See the [docs page](https://justintaddei.github.io/illusory/) for usage details and examples.

## Contributing

### Setup
```sh
$ git clone https://github.com/justintaddei/illusory
$ cd illusory
$ npm install
```

### Development

#### Building
```sh
$ npm run build

# Watch mode
$ npm run dev
```

#### Live-reload server
```sh
$ npm run serve
```

### Testing

Tests should be written in the same folder as the file being tested.  
Use the `[filename].spec.ts` naming convention.

#### Running tests

```sh
$ npm test
```

### /docs page

```sh
# Transpile ./docs/index.js
$ npm run build:docs

# Watch ./docs/index.js and build on save.
$ npm run dev:docs
```
