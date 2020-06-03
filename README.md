# illusory <!-- omit in toc -->

![GitHub build status](https://img.shields.io/github/workflow/status/justintaddei/illusory/Tests/master?logo=github)
![Open issues](https://img.shields.io/github/issues-raw/justintaddei/illusory.svg?style=flat)
![npm version](https://img.shields.io/npm/v/illusory.svg?style=flat)
![downloads](https://img.shields.io/npm/dt/illusory.svg?style=flat&label=npm+installs)
![license](https://img.shields.io/npm/l/illusory.svg?style=flat)
![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)
![language](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)
![Status](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

Seamlessly morph one element into another. [**Demo**](https://justintaddei.github.io/illusory/)

### Contents

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [API Overview](#api-overview)
  - [illusory(from, to [, options]): Promise](#illusoryfrom-to--options-promise)
  - [IllusoryElement(el [, options])](#illusoryelementel--options)
    - [Properties](#properties)
    - [Methods](#methods)
- [Advanced](#advanced)
  - [deltaHandlers](#deltahandlers)
    - [DeltaHandlerFunction(delta, deltaStyle, thisStyle)](#deltahandlerfunctiondelta-deltastyle-thisstyle)
  - [preserveDataAttributes](#preservedataattributes)
  - [processClone(node: Node, depth: number): Node | void](#processclonenode-node-depth-number-node--void)
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


## API Overview
> See the [docs page](https://justintaddei.github.io/illusory/) for an introduction with examples.


### illusory(from, to [, options]): Promise

- `from` — an `Element` or an `IllusoryElement`
- `to` — an `Element` or an `IllusoryElement`
- `options` — `Object` (see table below)

| option                 | type                                                               | default     |
| ---------------------- | ------------------------------------------------------------------ | ----------- |
| includeChildren        | `boolean`                                                          | `true`      |
| ignoreTransparency     | `boolean` \| `string[]`                                            | `['img']`   |
| compositeOnly          | `boolean`                                                          | `false`     |
| duration               | `string` (e.g. `0.5s`, `200ms`, etc.)                              | `300ms`     |
| easing                 | `string` (e.g. `ease-in-out`, `cubic-bezier(.29, 1.01, 1, -0.68)`) | `ease`      |
| zIndex                 | `number`                                                           | `1`         |
| deltaHandlers          | `Object` _(see [Advanced](#advanced))_                             | `undefined` |
| beforeAttach           | `Function` _(see [Advanced](#advanced))_                           | `undefined` |
| beforeAnimate          | `Function` _(see [Advanced](#advanced))_                           | `undefined` |
| beforeDetach           | `Function` _(see [Advanced](#advanced))_                           | `undefined` |
| preserveDataAttributes | `Function` \| `boolean` _(see [Advanced](#advanced))_              | `false`     |
| processClone           | `Function` _(see [Advanced](#advanced))_                           | `false`     |

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

| option                 | type                    | default     |
| ---------------------- | ----------------------- | ----------- |
| includeChildren        | `boolean`               | `true`      |
| ignoreTransparency     | `boolean` \| `string[]` | `['img']`   |
| zIndex                 | `number`                | `1`         |
| deltaHandlers          | `Object`                | `undefined` |
| preserveDataAttributes | `Function` \| `boolean` | `false`     |
| processClone           | `Function`              | `undefined` |

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


## Advanced

### deltaHandlers

An object where the keys are css properties and the values are either false (disabled) or a function that returns a new value for the repective property.

For example, the following snippet disables the handlers for transform and border-top-left-radius and creates a new handler for background-color that always returns "red".

While this example is not very practical, it illustrates how easily deltaHandlers can be used to change the look of the animation.

```js
illusory(from, to, {
  deltaHandlers: {
    transform: false,
    borderTopLeftRadius: false,
    backgroundColor(delta, deltaStyle, thisStyle) {
        return 'red'
    }
  }
})
```

#### DeltaHandlerFunction(delta, deltaStyle, thisStyle)
- `delta`
  -  `x`: number — The left edge of the "other" element.
  -  `y`: number — The top edge of the "other" element.
  -  `scaleX`: number — The difference in horizontal size between this element and the "other."
  -  `scaleY`: number — The difference in vertical size between this element and the "other."
  -  `inverseScaleX`: number — The difference in horizontal size between the "other" element and this one. 
  -  `inverseScaleY`: number — The difference in vertical size between the "other" element and this one.
-  `deltaStyle` — The computed style for the given property of other element. 
-  `thisStyle` — The computed style for the given property of this element. 

### preserveDataAttributes

By default, all data-* attributes are removed from the cloned elements to prevent issues with some front-end frameworks.
If you need to preserve some or all of those attributes you can define a filter function that returns `true` for any attribute that should be preserved.

> **Note:**  
> if you only need to keep some data with the element after it's cloned (e.g. to access it in `processClone`) you can use any `data-illusory[-*]` attribute because they are **always** preserved.
```js
  new IllusoryElement(el, {
    // Preserve all data-* attributes
    preserveDataAttributes: true

    // Preserve all data-mydata[-*] attributes
    preserveDataAttributes: (attrName) => attrName.startsWith('data-mydata') 
  })
```

### processClone(node: Node, depth: number): Node | void

A function that, if defined, is called for every clone, and `ChildNode` of that clone before the animation begins and before any hooks. 

```js
new IllusoryElement(el, {
  preserveDataAttributes: attr => attr === 'data-hide-from-animation',

  processClone(node, depth) {
    console.log(node.parentNode) // `undefined` because processClone starts from the deepest node in the tree.

    if (depth > 0) // Make sure this isn't the root node (e.i. the clone of `el`)
      if (node.dataset.hideFromAnimation) // Hide some elements from the animation
        node.style.opacity = '0'  
  }
})
```

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
