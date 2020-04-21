import { parseBorderRadius, stringifyBorderRadius } from './parseBorderRadius'

describe('border-radius is parsed correctly', () => {
  it('works with single-value syntax', () => {
    expect(parseBorderRadius('5%')).toEqual({
      x: {
        value: 5,
        unit: '%'
      },
      y: {
        value: 5,
        unit: '%'
      }
    })
    expect(parseBorderRadius('10.5px')).toEqual({
      x: {
        value: 10.5,
        unit: 'px'
      },
      y: {
        value: 10.5,
        unit: 'px'
      }
    })
  })

  it('works with douple-value syntax', () => {
    expect(parseBorderRadius('10px 5.2em')).toEqual({
      x: {
        value: 10,
        unit: 'px'
      },
      y: {
        value: 5.2,
        unit: 'em'
      }
    })
    expect(parseBorderRadius('3.33% 10vw')).toEqual({
      x: {
        value: 3.33,
        unit: '%'
      },
      y: {
        value: 10,
        unit: 'vw'
      }
    })
  })

  it('return default on invalid value', () => {
    const defaultBorderRadius = {
      x: {
        value: 0,
        unit: 'px'
      },
      y: {
        value: 0,
        unit: 'px'
      }
    }
    expect(parseBorderRadius('')).toEqual(defaultBorderRadius)
    expect(parseBorderRadius('asdf')).toEqual(defaultBorderRadius)
  })
})

it('border-radius is stringified correctly', () => {
  const radii = {
    x: {
      value: 5,
      unit: 'em'
    },
    y: {
      value: 10.5,
      unit: '%'
    }
  }

  expect(stringifyBorderRadius(radii)).toBe('5em 10.5%')
})
