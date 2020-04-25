# illusory <!-- omit in toc -->

![](https://img.shields.io/github/workflow/status/justintaddei/illusory/Tests/master?logo=github)
![](https://img.shields.io/github/issues-raw/justintaddei/illusory.svg?style=flat)
![](https://img.shields.io/npm/v/illusory.svg?style=flat)
![](https://img.shields.io/npm/dt/illusory.svg?style=flat)
![](https://img.shields.io/npm/l/illusory.svg?style=flat)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![](https://img.shields.io/github/languages/top/justintaddei/illusory.svg?colorB=blue&style=flat)
![](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

Seamlessly morph one element into another. [**Demo**](https://justintaddei.github.io/illusory/)

### Contents

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [API Details](#api-details)
  - [illusory(from, to [, options]): Promise](#illusoryfrom-to--options-promise)
  - [IllusoryElement(el [, options])](#illusoryelementel--options)
    - [Properties](#properties)
    - [Methods](#methods)
- [Contributing](#contributing)
  - [Setup](#setup)
  - [Development](#development)
    - [Building](#building)
    - [Live-reload server](#live-reload-server)
  - [Testing](#testing)
    - [Running tests](#running-tests)
  - [/docs page](#docs-page)

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


## API Details
> **Note:** See the [docs page](https://justintaddei.github.io/illusory/) for a friendlier introduction.


### illusory(from, to [, options]): Promise

- `from` — an `Element` or an `IllusoryElement`
- `to` — an `Element` or an `IllusoryElement`
- `options` — `Object` (see table below)

| option          | type     | default   |
| --------------- | -------- | --------- |
| includeChildren | boolean  | true      |
| compositeOnly   | boolean  | false     |
| duration        | string   | 300ms     |
| easing          | string   | ease      |
| zIndex          | number   | 1         |
| deltaHandlers   | Object   | undefined |
| beforeAttach    | Function | undefined |
| beforeAnimate   | Function | undefined |
| beforeDetach    | Function | undefined |

### IllusoryElement(el [, options])

- `el` — `Element`
- `options` — `Object` (see table below)

| option          | type    | default   |
| --------------- | ------- | --------- |
| includeChildren | boolean | true      |
| zIndex          | number  | 1         |
| deltaHandlers   | Object  | undefined |

#### Properties

- `natural` — `Element`
- `clone` — `Element`
- `rect` — `DOMRect`
  
#### Methods

- `setStyle(property: string, value: string)`
- `getStyle(property: string): string`
- `waitFor(property: string): Promise`
- `hide()`
- `show()`
- `hideNatural()`
- `showNatural()`
- `flushCSS()`
- `detach()`


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
