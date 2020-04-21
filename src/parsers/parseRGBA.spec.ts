import { parseRGBA } from './parseRGBA'

describe('Parses RGBA strings', () => {
  describe('parses rgba() syntax', () => {
    it('works for alpha values < 1', () => {
      expect(parseRGBA('rgba(14, 16, 255, 0.5)')).toEqual({
        r: 14,
        g: 16,
        b: 255,
        a: 0.5
      })
    })
    it('works for alpha values of 1', () => {
      expect(parseRGBA('rgba(14, 16, 255, 1)')).toEqual({
        r: 14,
        g: 16,
        b: 255,
        a: 1
      })
    })
    it('works for alpha values of 0', () => {
      expect(parseRGBA('rgba(14, 16, 255, 0)')).toEqual({
        r: 14,
        g: 16,
        b: 255,
        a: 0
      })
    })
    it('returns false if not valid rgba', () => {
      expect(parseRGBA('rgba(14, 16, 255)')).toBe(false)
      expect(parseRGBA('rgb(14, 16, 255)')).toBe(false)
      expect(parseRGBA('rgba(14, 16)')).toBe(false)
      expect(parseRGBA('rgba(14, 16, 255, f)')).toBe(false)
    })
  })

  describe('parses #rgba and #rrggbbaa syntax', () => {
    describe('8-digit syntax', () => {
      it('works for alpha 0 < value < 1', () => {
        expect(parseRGBA('#0e10ff80')).toEqual({
          r: 14,
          g: 16,
          b: 255,
          a: 0.5
        })
      })
      it('works for alpha values of 1', () => {
        expect(parseRGBA('#0e10ffff')).toEqual({
          r: 14,
          g: 16,
          b: 255,
          a: 1
        })
      })
      it('works for alpha values of 0', () => {
        expect(parseRGBA('#0e10ff00')).toEqual({
          r: 14,
          g: 16,
          b: 255,
          a: 0
        })
      })
    })
    it('returns false if not valid hex-a color', () => {
      expect(parseRGBA('0e10ff80')).toBe(false)
      expect(parseRGBA('#0e10ff8')).toBe(false)
      expect(parseRGBA('#0e10ff')).toBe(false)
      expect(parseRGBA('#0e1')).toBe(false)
      expect(parseRGBA('#0e')).toBe(false)
    })
  })
})
