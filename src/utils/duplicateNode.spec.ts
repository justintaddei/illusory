import { duplicateNode } from './duplicateNode'

function createEl() {
  const div = document.createElement('div')
  const p = document.createElement('p')
  p.textContent = 'Test'
  p.dataset.testing = 'test'
  p.dataset.alsoTesting = 'test'
  p.dataset.illusory = 'always preserved'
  div.appendChild(p)

  return div
}

describe('includeChildren works', () => {
  const el = createEl()

  describe('Includes all children when true', () => {
    it('includes the children', () => {
      const dup = duplicateNode(el, {
        includeChildren: true
      })

      const p = dup.querySelector('p')

      expect(p).toBeInstanceOf(HTMLParagraphElement)
    })
    it('copies the styles for the children', () => {
      const dup = duplicateNode(el, {
        includeChildren: true
      })

      const p = dup.querySelector('p') as HTMLParagraphElement

      expect(p.style.cssText.length).toBeGreaterThan(0)
    })
  })

  it('does not includes any children when false', () => {
    const dup = duplicateNode(el, {
      includeChildren: false
    })

    const p = dup.querySelector('p')

    expect(p).toBeNull()
  })
})

describe('preserveDataAttributes works', () => {
  const el = createEl()

  it('removes all data-* attributes exect for data-illusory-* when false', () => {
    const dup = duplicateNode(el, {
      includeChildren: true,
      preserveDataAttributes: false
    })

    const p = dup.querySelector('p') as HTMLParagraphElement

    expect(p.dataset).toHaveProperty('illusory')
    expect(p.dataset).not.toHaveProperty('testing')
    expect(p.dataset).not.toHaveProperty('alsoTesting')
  })

  it('preserves all data-* attributes when true', () => {
    const dup = duplicateNode(el, {
      includeChildren: true,
      preserveDataAttributes: true
    })

    const p = dup.querySelector('p') as HTMLParagraphElement

    expect(p.dataset).toMatchObject({
      testing: 'test',
      alsoTesting: 'test',
      illusory: 'always preserved'
    })
  })

  it('accepts a filter function', () => {
    const dup = duplicateNode(el, {
      includeChildren: true,
      preserveDataAttributes: attr => attr.includes('also')
    })

    const p = dup.querySelector('p') as HTMLParagraphElement

    expect(p.dataset).toMatchObject({
      alsoTesting: 'test',
      illusory: 'always preserved'
    })

    expect(p.dataset).not.toHaveProperty('testing')
  })
})
