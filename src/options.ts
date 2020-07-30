import { IDeltaHandlerConfigMap } from './deltaHandlers/delta'
import { IllusoryElement } from './IllusoryElement'
import { CloneProcessorFunction, FilterFunction } from './utils/duplicateNode'

export interface IOptions {
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
   * If `false` and the element we're transitioning **to** has a transparent background then
   * the element we're transitioning from will fade out.
   * If `true` the transparency of the elements background will be ignored.
   *
   * This can also be an array of tag names which should be ignored (e.g. `['img', 'button']`).
   * @default ['img']
   */
  ignoreTransparency: boolean | string[]
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
   * An object where the keys are css properties and the values are either `false` (disabled) or
   * a function that returns a new value for the respective property.
   *
   * For example, the following snippet disables the handlers for `transform` and `border-top-left-radius`
   * and creates a new handler for `background-color` that always returns "red".
   *
   * While this example is not very practical, it illustrates how easily deltaHandlers can be
   * used to change the look of the animation.
   *
   * @example
   *
   * illusory(from, to, {
   *   deltaHandlers: {
   *     transform: false,
   *     borderTopLeftRadius: false,
   *     backgroundColor(delta, deltaStyle, thisStyle) {
   *         return 'red'
   *     }
   *   }
   * })
   */
  deltaHandlers?: IDeltaHandlerConfigMap
  /**
   * Called after the clone is created, but before the clone is appended to the DOM.
   *
   * @remarks If you return a promise, illusory will wait for the promise to resolve.
   */
  beforeAttach?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
  /**
   * Called after the clone is appended to the DOM and the natural element has been
   * hidden, but before the animation begins.
   *
   * @remarks If you return a promise, illusory will wait for the promise to resolve.
   */
  beforeAnimate?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
  /**
   * Called after the animation is completed, but before the clone is removed from the DOM.
   *
   * @remarks If you return a promise, illusory will wait for the promise to resolve.
   */
  beforeDetach?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
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

export const DEFAULT_OPTIONS: IOptions = {
  includeChildren: true,
  ignoreTransparency: ['img'],
  duration: '300ms',
  easing: 'ease',
  zIndex: 1,
  compositeOnly: false,
  relativeTo: [document]
}
