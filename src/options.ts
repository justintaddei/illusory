import { IllusoryElement } from './IllusoryElement'
import { CloneProcessorFunction, FilterFunction } from './utils/duplicateNode'

export interface IIllusoryElementOptions {
  /**
   * By default, illusory creates a deep clone of each element.
   * When setting this to `false`, illusory will only perform a shallow clone.
   *
   * *Example:*
   *
   * `includeChildren: true`
   *
   * ![](https://github.com/justintaddei/illusory/blob/assets/includeChildren_true.gif?raw=true)
   *
   * `includeChildren: false`
   *
   * ![](https://github.com/justintaddei/illusory/blob/assets/includeChildren_false.gif?raw=true)
   *
   * @default true
   */
  includeChildren: boolean
  /**
   * If `false` and the element we're transitioning **to** has a transparent background then
   * the element we're transitioning from will fade out.
   * If `true` the transparency of the elements background will be ignored.
   *
   * This can also be an array of tag names which should be ignored (e.g. `['img', 'button']`).
   * @default ['img']
   */
  ignoreTransparency: boolean | string[]
  /**
   * If `false` all `data-*` attributes are removed.
   * Can also be a function that returns `true` if the attribute should be preserved.
   *
   * All `data-illusory-*` attributes are always preserved.
   *
   * @default false
   */
  preserveDataAttributes?: boolean | FilterFunction
  /**
   * Called while creating the clone, and then for every ChildNode of
   * the clone (if `includeChildren: true`). This happens before the `beforeAttach` hook is called.
   *
   * @example
   *  new IllusoryElement(el, {
   *    processClone(node, depth) {
   *      if (depth > 0) // Make sure this isn't the root node (e.i. the clone of `el`)
   *        if (node.tagName === 'VIDEO') // Remove any <video> elements from the clone
   *          return null
   *    }
   *  })
   */
  processClone?: CloneProcessorFunction
  /**
   * If `true`, `this.attach()` is invoked as soon as the instance is created.
   * @default false
   */
  attachImmediately?: boolean
}

export interface IIllusoryControls {
  /**
   * Resolves when the animation is finished
   * Resolves to `true` if the animation was not canceled
   */
  finished: Promise<boolean>
  /**
   * Immediately cancels the animation
   */
  cancel: () => void
}

export interface IIllusoryOptions {
  /**
   * Options pertaining to `IllusoryElement`s
   */
  element: IIllusoryElementOptions
  /**
   * By default, illusory will animate `transform`, `opacity`,
   * and `border-radius` (`background` is not animated.
   * Rather, the two elements are cross-faded to give the illusion of it being animated).
   * Setting `compositeOnly` to `true` will disable the `border-radius` animation, leaving only `transform` and `opacity`.
   *
   * *Example:*
   *
   * `compositeOnly: true`
   *
   * ![](https://github.com/justintaddei/illusory/blob/assets/compositeOnly.gif?raw=true)
   *
   * @default false
   */
  compositeOnly: boolean
  /**
   * A CSS `<time>`. e.g. `2s`, `150ms`, etc.
   * @default "300ms"
   */
  duration: string
  /**
   * A CSS `<timing-function>`. e.g. `ease-out`, `cubic-bezier(.29, 1.01, 1, -0.68)`, etc.
   * @default "ease"
   */
  easing: string
  /**
   * The `z-index` of the clones
   * @default 1
   */
  zIndex: number
  /**
   * Called after the clone is appended to the DOM and the natural element has been
   * hidden, but before the animation begins.
   *
   * @remarks If you return a promise, illusory will wait for the promise to resolve.
   */
  beforeAnimate?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<unknown>
  /**
   * Called after the animation is completed, but before the clone is removed from the DOM.
   *
   * @remarks If you return a promise, illusory will wait for the promise to resolve.
   */
  beforeDetach?: (from: IllusoryElement, to: IllusoryElement, canceled: boolean) => void | Promise<unknown>
  /**
   * An array of scrollable elements (including `document`).
   * Illusory will listen to `scroll` events on these targets and update the position of the
   * `IllusoryElement`s so that they appear to remain relative to the given container.
   *
   * @tip specifying an empty array (`[]`) will cause the `IllusoryElement`s to remain fixed in the viewport.
   *
   * @default [document]
   */
  relativeTo: (HTMLElement | Document)[]
}

export const DEFAULT_OPTIONS: IIllusoryOptions = {
  element: {
    includeChildren: true,
    ignoreTransparency: ['img']
  },
  zIndex: 1,
  compositeOnly: false,
  duration: '300ms',
  easing: 'ease',
  relativeTo: [document]
}
