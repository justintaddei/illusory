interface IOrigin {
  x: number
  y: number
}

export function parseTransformOrigin(originString: string): IOrigin {
  const origin = originString.split(' ').map(parseFloat)

  return {
    x: origin[0],
    y: origin[1]
  }
}
