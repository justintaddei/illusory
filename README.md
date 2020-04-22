# illusory <!-- omit in toc -->

Seamlessly morph one element into another. **Demo**

### Contents

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Advanced usage](#advanced-usage)
  - [illusory(from, to [, options])](#illusoryfrom-to--options)

## Installation

```html
<script src="unpkg.com/illusory"></script>

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

### or <!-- omit in toc -->

```js
illusory(from, to).then(() => {
  // morph complete
})
```

## Advanced usage

### illusory(from, to [, options])

- `from` — an `HTMLElement` or an `IllusoryElement`
- `to` — an `HTMLElement` or an `IllusoryElement`
- `options`
