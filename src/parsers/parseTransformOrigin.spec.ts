import { parseTransformOrigin } from './parseTransformOrigin'

test('It returns x and y as floats', () => {
  expect(parseTransformOrigin('45.6px 100.43px')).toEqual({
    x: 45.6,
    y: 100.43
  })
})
