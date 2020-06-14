import { IllusoryElement } from '../IllusoryElement'

interface IDelta {
  x: number
  y: number
  scaleX: number
  scaleY: number
  inverseScaleX: number
  inverseScaleY: number
}

type DeltaHandlerFunction = (delta: IDelta, deltaStyle: string, thisStyle: string) => string
interface IDeltaHandlerMap {
  [propertyName: string]: DeltaHandlerFunction
}
interface IDeltaHandlerConfigMap {
  [propertyName: string]: DeltaHandlerFunction | false
}

const DELTA_PASS_THROUGH_HANDLER: DeltaHandlerFunction = (_, __, thisStyle) => thisStyle

function getDelta(from: IllusoryElement, to: IllusoryElement): IDelta {
  return {
    x: to.rect.left - from.rect.left,
    y: to.rect.top - from.rect.top,
    scaleX: to.rect.width / from.rect.width,
    scaleY: to.rect.height / from.rect.height,
    inverseScaleX: from.rect.width / to.rect.width,
    inverseScaleY: from.rect.height / to.rect.height
  }
}

export { getDelta, DeltaHandlerFunction, IDeltaHandlerMap, IDeltaHandlerConfigMap, IDelta, DELTA_PASS_THROUGH_HANDLER }
