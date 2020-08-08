import { IDelta } from './delta'
import { fromString, toString, translate, scale, identity, Matrix3D, multiply } from 'rematrix'

const IDENTITY_MATRIX = identity()

export default function transformHandler(delta: IDelta, deltaStyle: string) {
  let originalMatrixOfDeltaElement: Matrix3D

  if (deltaStyle.startsWith('matrix')) originalMatrixOfDeltaElement = fromString(deltaStyle)
  else originalMatrixOfDeltaElement = IDENTITY_MATRIX

  const deltaMatrix = [translate(delta.x, delta.y), originalMatrixOfDeltaElement, scale(delta.scaleX, delta.scaleY)]

  let transformString: string

  try {
    transformString = toString(deltaMatrix.reduce(multiply))
  } catch (e) {
    if (process && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test')
      console.error('[illusory] Failed to construct transform matrix. Is the element in the DOM?')
    return 'none'
  }

  return transformString
}
