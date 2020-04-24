import transformHandler from './transformHandler'
import { IDelta } from './delta'

it('Correctly handles transform', () => {
  const delta = {
    x: 20 as IDelta['x'],
    y: 20 as IDelta['y'],
    scaleX: 0.5 as IDelta['scaleX'],
    scaleY: 0.5 as IDelta['scaleY']
  }

  expect(transformHandler(delta as IDelta)).toBe(
    `translate(${delta.x}px,${delta.y}px) scale(${delta.scaleX}, ${delta.scaleY})`
  )
})