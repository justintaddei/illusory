import borderRadius from './borderRadiusHandler'
import { IDelta } from './delta'

describe('Correctly handles border-radius', () => {
  it('works with <length> value', () => {
    const delta = {
      inverseScaleX: 2 as IDelta['inverseScaleX'],
      inverseScaleY: 0.5 as IDelta['inverseScaleY']
    }
    const borderRadiusValue = '25px'

    expect(borderRadius(delta as IDelta, borderRadiusValue)).toBe('50px 12.5px')
  })
  it('works with <length> <length> value', () => {
    const delta = {
      inverseScaleX: 2 as IDelta['inverseScaleX'],
      inverseScaleY: 0.5 as IDelta['inverseScaleY']
    }
    const borderRadiusValue = '25px 50em'

    expect(borderRadius(delta as IDelta, borderRadiusValue)).toBe('50px 25em')
  })

  describe("doesn't alter <percent> values", () => {
    it('works with <length> <percent> value', () => {
      const delta = {
        inverseScaleX: 2 as IDelta['inverseScaleX'],
        inverseScaleY: 0.5 as IDelta['inverseScaleY']
      }
      const borderRadiusValue = '25px 50%'

      expect(borderRadius(delta as IDelta, borderRadiusValue)).toBe('50px 50%')
    })
    it('works with <percent> <length> value', () => {
      const delta = {
        inverseScaleX: 2 as IDelta['inverseScaleX'],
        inverseScaleY: 0.5 as IDelta['inverseScaleY']
      }
      const borderRadiusValue = '25% 50px'

      expect(borderRadius(delta as IDelta, borderRadiusValue)).toBe('25% 25px')
    })
    it('works with <percent> <percent> value', () => {
      const delta = {
        inverseScaleX: 2 as IDelta['inverseScaleX'],
        inverseScaleY: 0.5 as IDelta['inverseScaleY']
      }
      const borderRadiusValue = '25% 50%'

      expect(borderRadius(delta as IDelta, borderRadiusValue)).toBe('25% 50%')
    })
    it('works with <percent> value', () => {
      const delta = {
        inverseScaleX: 2 as IDelta['inverseScaleX'],
        inverseScaleY: 0.5 as IDelta['inverseScaleY']
      }
      const borderRadiusValue = '25%'

      expect(borderRadius(delta as IDelta, borderRadiusValue)).toBe('25% 25%')
    })
  })
})
