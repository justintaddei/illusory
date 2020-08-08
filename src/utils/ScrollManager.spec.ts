import ScrollManager from './ScrollManager'

let documentHasScrollListener = false

document.addEventListener = function(this: Document, event: 'scroll', listener: (e: Event) => void, capture: boolean) {
  if (event === 'scroll' && typeof listener === 'function' && capture) documentHasScrollListener = true
}
document.removeEventListener = function(
  this: Document,
  event: 'scroll',
  listener: (e: Event) => void,
  capture: boolean
) {
  if (event === 'scroll' && typeof listener === 'function' && capture) documentHasScrollListener = false
}

describe('Add and removes handlers', () => {
  const listener = { dependencies: [document], handler() {} }

  it('Added the event listener to document', () => {
    ScrollManager.add(listener)
    expect(documentHasScrollListener).toBe(true)
  })

  it('Removed the event listener from document', () => {
    ScrollManager.remove(listener)
    expect(documentHasScrollListener).toBe(false)
  })
})
