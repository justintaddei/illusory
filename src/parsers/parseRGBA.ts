const RGBA_REGEX = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([01](?:\.\d+)?)\)$/i
const isHex = (hex: string) => /^#([a-f0-9]{4}){1,2}$/i.test(hex)

const hexChunkSize = (hex: string) => Math.floor((hex.length - 1) / 3)

const seperateHex = (hex: string) => hex.match(new RegExp(`.{${hexChunkSize(hex)}}`, 'g'))

const hexToDec = (hex: string) => parseInt(hex.repeat(2 / hex.length), 16)

const getAlphaFloat = (a: number) => +(a / 256).toFixed(2)

export const hexToRGBA = (hexArr: string[]) => {
  const [r, g, b, a] = hexArr.map(hexToDec)

  return [r, g, b, getAlphaFloat(a)]
}

interface IRGBADescriptor {
  r: number
  g: number
  b: number
  a: number
}

export function parseRGBA(color: string): IRGBADescriptor | false {
  const rgba = RGBA_REGEX.exec(color)

  let r: number
  let g: number
  let b: number
  let a: number

  if (rgba) {
    ;[r, g, b, a] = rgba.slice(1, 5).map(parseFloat)
  } else if (isHex(color)) {
    const hexArray = seperateHex(color.slice(1))

    if (!hexArray) return false
    ;[r, g, b, a] = hexToRGBA(hexArray)
  } else return false

  return { r, g, b, a }
}
