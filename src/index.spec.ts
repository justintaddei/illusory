import { illusory, IllusoryElement } from './index'

describe('exports', () => {
  it('exports illusory', () => {
    expect(typeof illusory).toBe('function')
  })
  it('exports IllusoryElement', () => {
    expect(typeof IllusoryElement).toBe('function')
  })
})

it('returns a Promise', () => {
  const el1 = document.createElement('div')
  const el2 = document.createElement('div')

  const promise = illusory(el1, el2)

  expect(promise).toHaveProperty('then')
})
