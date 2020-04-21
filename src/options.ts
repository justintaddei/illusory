import { IllusoryElement } from './IllusoryElement'
import { IDeltaHandlerMap } from './deltaHandlers/delta'

export interface IOptions {
  /**
   * If `true`, a deep clone is performed
   * so that the children are included in the animation
   * @default false
   */
  includeChildren: boolean
  /**
   * If `true`, only compositable properties will be animated
   * (transform and opacity)
   * @default false
   */
  compositeOnly: boolean
  /**
   * A CSS `<time>`. e.g. `2s`, `150ms`, etc.
   */
  duration: string
  /**
   * A CSS `<timing-function>`. e.g. `ease-out`, `cubic-bezier(.29, 1.01, 1, -0.68)`, etc.
   */
  easing: string
  zIndex: number
  detlaHandlerOverrides?: IDeltaHandlerMap
  beforeAttach?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
  beforeAnimate?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
  beforeDetach?: (from: IllusoryElement, to: IllusoryElement) => void | Promise<void>
}

export const DEFAULT_OPTIONS: IOptions = {
  includeChildren: false,
  duration: '300ms',
  easing: 'ease',
  zIndex: 1,
  compositeOnly: false
}
