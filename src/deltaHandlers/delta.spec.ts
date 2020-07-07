import { IllusoryElement } from '../IllusoryElement'
import { getDelta } from './delta'

it('Calculates the correct delta', () => {
  const deltaFrom = {
    rect: {
      top: 50,
      left: 40,
      width: 300,
      height: 500
    },
    getStyle: (prop: string) => (prop === 'transformOrigin' ? '50px 50px' : '')
  }
  const deltaTo = {
    rect: {
      top: 25,
      left: 90,
      width: 600,
      height: 250
    },
    // This shouldn't effect the delta
    getStyle: (prop: string) => (prop === 'transformOrigin' ? '150px 150px' : '')
  }

  expect(getDelta(deltaFrom as IllusoryElement, deltaTo as IllusoryElement)).toEqual({
    x: 100,
    y: -50,
    scaleX: 2,
    scaleY: 0.5,
    inverseScaleX: 0.5,
    inverseScaleY: 2
  })
})
