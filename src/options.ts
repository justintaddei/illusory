import { DeltaHandlerFunction } from './deltaHandlers/delta'
import { IllusoryElement } from './IllusoryElement'
import { FilterFunction, CloneProcessorFunction } from './utils/duplicateNode'

export interface IOptions {
  /**
   * If `true`, a deep clone is performed
   * so that the children are included in the animation
   * @default true
   */
  includeChildren: boolean
  /**
   * If `true`, only compositable properties will be animated
   * (transform and opacity)
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
  deltaHandlers?: {
    [property: string]: DeltaHandlerFunction | false
  }
  beforeAttach?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
  beforeAnimate?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
  beforeDetach?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
  /**
   * If `false` all `data-*` attributes are removed.
   * Can also be a function that returns `true` if the attribute should be preserved.
   * All `data-illusory-*` attributes are always preserved.
   * @default false
   */
  preserveDataAttributes?: boolean | FilterFunction
  processClone?: CloneProcessorFunction
}

export const DEFAULT_OPTIONS: IOptions = {
  includeChildren: true,
  ignoreTransparency: ['img'],
  duration: '300ms',
  easing: 'ease',
  zIndex: 1,
  compositeOnly: false
}
