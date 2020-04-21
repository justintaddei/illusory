/*
  Border-radius syntax (https://drafts.csswg.org/css-backgrounds-3/#the-border-radius)

  <length-percentage>{1,2}
  where 
  <length-percentage> = <length> | <percentage> 
*/
const BORDER_RADIUS_REGEX = /^(\d+(?:\.\d+)?)([^\d\s.]+)(?:\s+(\d+(?:\.\d+)?)([^\d\s.]+))?$/

interface IBorderRadiusDescriptor {
  x: IBorderRadius
  y: IBorderRadius
}

interface IBorderRadius {
  value: number
  unit: string
}

export function parseBorderRadius(borderRadius: string): IBorderRadiusDescriptor {
  const parsedBorderRadius = BORDER_RADIUS_REGEX.exec(borderRadius)
  let x: IBorderRadius
  let y: IBorderRadius

  x = {
    value: +(parsedBorderRadius?.[1] ?? 0),
    unit: parsedBorderRadius?.[2] ?? 'px'
  }

  if (parsedBorderRadius?.[3])
    y = {
      value: +(parsedBorderRadius?.[3] ?? 0),
      unit: parsedBorderRadius?.[4] ?? 'px'
    }
  else y = { ...x }

  return {
    x,
    y
  }
}

export function stringifyBorderRadius(radii: IBorderRadiusDescriptor): string {
  return `${radii.x.value}${radii.x.unit} ${radii.y.value}${radii.y.unit}`
}
