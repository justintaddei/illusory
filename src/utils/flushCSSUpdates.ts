import { IllusoryElement } from '../IllusoryElement'

export default function flushCSSUpdates(el1: IllusoryElement, el2?: IllusoryElement) {
  el1.clone.offsetHeight
  el2?.clone.offsetHeight
}
