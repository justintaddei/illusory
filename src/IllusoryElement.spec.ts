import { IllusoryElement } from './IllusoryElement'

describe('Implements the correct public interface', () => {
  const el = document.createElement('div')

  const illusoryElement = new IllusoryElement(el)

  it('has the correct structure', () => {
    expect(illusoryElement.natural).toBeInstanceOf(HTMLElement)
    expect(illusoryElement.clone).toBeInstanceOf(HTMLElement)
    expect(typeof illusoryElement.rect).toBe('object')
    expect(typeof illusoryElement.isAttached).toBe('boolean')

    expect(illusoryElement.getStyle).toBeInstanceOf(Function)
    expect(illusoryElement.setStyle).toBeInstanceOf(Function)
    expect(illusoryElement.waitFor).toBeInstanceOf(Function)
    expect(illusoryElement.hide).toBeInstanceOf(Function)
    expect(illusoryElement.hideNatural).toBeInstanceOf(Function)
    expect(illusoryElement.show).toBeInstanceOf(Function)
    expect(illusoryElement.showNatural).toBeInstanceOf(Function)
    expect(illusoryElement.flushCSS).toBeInstanceOf(Function)
    expect(illusoryElement.attach).toBeInstanceOf(Function)
    expect(illusoryElement.detach).toBeInstanceOf(Function)
  })

  test('IllusoryElement.natural is the original element', () => {
    expect(illusoryElement.natural).toBe(el)
  })
})
