# illusory <!-- omit in toc -->

![GitHub build status](https://img.shields.io/github/workflow/status/justintaddei/illusory/Tests/master?logo=github)
![Open issues](https://img.shields.io/github/issues-raw/justintaddei/illusory.svg?style=flat)
![npm version](https://img.shields.io/npm/v/illusory.svg?style=flat)
![downloads](https://img.shields.io/npm/dt/illusory.svg?style=flat&label=npm+installs)
![license](https://img.shields.io/npm/l/illusory.svg?style=flat)
![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)
![Top language](https://img.shields.io/github/languages/top/justintaddei/illusory.svg?colorB=blue&style=flat)
![Status](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

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
> See the [docs page](https://justintaddei.github.io/illusory/) for an introduction with examples.


### illusory(from, to [, options]): Promise

- `from` — an `Element` or an `IllusoryElement`
- `to` — an `Element` or an `IllusoryElement`
- `options` — `Object` (see table below)

| option                 | type                | default   |
| ---------------------- | ------------------- | --------- |
| includeChildren        | boolean             | true      |
| compositeOnly          | boolean             | false     |
| duration               | string              | 300ms     |
| easing                 | string              | ease      |
| zIndex                 | number              | 1         |
| deltaHandlers          | Object              | undefined |
| beforeAttach           | Function            | undefined |
| beforeAnimate          | Function            | undefined |
| beforeDetach           | Function            | undefined |
| preserveDataAttributes | Function \| Boolean | false     |

> **Important**  
> Options that are also available for `IllusoryElement` will not apply to `IllusoryElement`s when passed to `illusory`  
> For example:  
> In the following snippet, `from` **will** include all of its children because `includeChildren` defaults to `true`. However, `to` will **not** include _its_ children.  
```js
const from = new IllusoryElement(el)

const to = document.querySelector('#to')

illusory(from, to, {
  includeChildren: false
})

```

### IllusoryElement(el [, options])

- `el` — `Element`
- `options` — `Object` (see table below)

| option                 | type                | default   |
| ---------------------- | ------------------- | --------- |
| includeChildren        | boolean             | true      |
| zIndex                 | number              | 1         |
| deltaHandlers          | Object              | undefined |
| preserveDataAttributes | Function \| Boolean | false     |

#### Properties

- `natural`: `Element` — The original element.
- `clone`: `Element` — The clone of the "natural" element.
- `rect`: `DOMRect` — The bounding box of the "natural" element.
  
#### Methods

- `setStyle(property: string, value: string)` — Sets the given css style on the cloned element.
  > Changes made using this method will not be reflected by `getStyle`.
  ```js
  // If the background is white
  illusoryEl.clone.style.backgroundColor // #fff
  // And we set it to black with `getStyle`
  illusoryEl.setStyle('backgroundColor', '#000')
  // The color will be reflected be the DOM
  illusoryEl.clone.style.backgroundColor // #000
  // But not by `getStyle`. It will still return white
  illusoryEl.getStyle('backgroundColor') // #fff
  ```

- `getStyle(property: string): string` — Returns the orignal style value for the given property.  
  > **Note:** Because `window.getComputedStyle` is used under the hood, CSS shorthand properties are not supported (background, border-radius, etc.). Instead use background-color, background-image, border-bottom-right-radius, etc.

- `waitFor(property: string): Promise` —  
  Returns a `Promise` that resolves when the cloned element emits a `"transitionend"` event for the given `property`.  
  If `"any"` is passed, the promise will resolve on the first `"transitionend"` regardless of the transitioned property.

- `hide()` — Hides the cloned element
- `show()` — Shows the cloned element
- `hideNatural()` — Hides the natural element
- `showNatural()` — Shows the natural element
- `flushCSS()` — Forces the browser to apply any style changes that might be queued.
  > Useful for applying any css changes before setting a transition on the element.
- `detach()` — Removes the clone and cleans up styles applied to the natural element.


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
