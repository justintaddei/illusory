import { buildTransitionString } from './transition'

describe('Builds correct transition string', () => {
  it('works when IOptions.compositeOnly = false', () => {
    expect(
      buildTransitionString({
        duration: '3s',
        easing: 'ease-in-out',
        compositeOnly: false,
        includeChildren: false,
        zIndex: 1
      })
    ).toBe('all 3s ease-in-out 0s')
  })
  it('works when IOptions.compositeOnly = true', () => {
    expect(
      buildTransitionString({
        duration: '3s',
        easing: 'ease-in-out',
        compositeOnly: true,
        includeChildren: false,
        zIndex: 1
      })
    ).toBe('transform 3s ease-in-out 0s, opacity 3s ease-in-out 0s')
  })
})
