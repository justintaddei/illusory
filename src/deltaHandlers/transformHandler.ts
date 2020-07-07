import { IDelta } from './delta'
import { fromString, toString, translate, scale, identity, Matrix3D, multiply } from 'rematrix'

const IDENTITY_MATRIX = identity()

export default function transformHandler(delta: IDelta, deltaStyle: string) {
  let originalMatrixOfDeltaElement: Matrix3D

  if (!deltaStyle.startsWith('matrix')) originalMatrixOfDeltaElement = IDENTITY_MATRIX
  else originalMatrixOfDeltaElement = fromString(deltaStyle)

  const deltaMatrix = [translate(delta.x, delta.y), originalMatrixOfDeltaElement, scale(delta.scaleX, delta.scaleY)]

  return toString(deltaMatrix.reduce(multiply))
}
