import transformHandler from './transformHandler'
import { IDelta } from './delta'

it('Correctly handles transform', () => {
  const delta = {
    x: 20 as IDelta['x'],
    y: 20 as IDelta['y'],
    scaleX: 0.5 as IDelta['scaleX'],
    scaleY: 0.5 as IDelta['scaleY']
  }

  expect(transformHandler(delta as IDelta, 'matrix3d(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, 20, 20, 0, 1)')).toBe(
    `matrix3d(0.25, 0, 0, 0, 0, 0.25, 0, 0, 0, 0, 1, 0, 40, 40, 0, 1)`
  )
})
