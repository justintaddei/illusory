import { IllusoryElement } from '../IllusoryElement'
import { getDelta } from './delta'

it('Calculates the correct delta', () => {
  const deltaFrom = {
    rect: {
      top: 50,
      left: 40,
      width: 300,
      height: 500
    }
  }
  const deltaTo = {
    rect: {
      top: 25,
      left: 90,
      width: 600,
      height: 250
    }
  }

  expect(getDelta(deltaFrom as IllusoryElement, deltaTo as IllusoryElement)).toEqual({
    x: 50,
    y: -25,
    scaleX: 2,
    scaleY: 0.5,
    inverseScaleX: 0.5,
    inverseScaleY: 2
  })
})
