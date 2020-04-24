import { IDelta } from './delta'
import { parseBorderRadius, stringifyBorderRadius } from '../parsers/parseBorderRadius'

export default function borderRadiusHandler(delta: IDelta, borderRadius: string) {
  const radii = parseBorderRadius(borderRadius)

  if (radii.x.unit !== '%') radii.x.value = radii.x.value * delta.inverseScaleX
  if (radii.y.unit !== '%') radii.y.value = radii.y.value * delta.inverseScaleY

  return stringifyBorderRadius(radii)
}
