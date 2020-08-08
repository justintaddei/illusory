import { IllusoryElement } from '../IllusoryElement'

/**
 * Forces the browser to flush any pending style changes
 *
 * In the future, it might be worth implementing a render loop similar to *FrameSync*
 */
export default function flushCSSUpdates(el1: IllusoryElement, el2?: IllusoryElement) {
  el1.clone.clientWidth
  el2?.clone.clientWidth
}
