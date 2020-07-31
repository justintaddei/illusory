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

  const { finished, cancel } = illusory(el1, el2)

  expect(finished).toHaveProperty('then')
  expect(cancel).toBeInstanceOf(Function)
})
