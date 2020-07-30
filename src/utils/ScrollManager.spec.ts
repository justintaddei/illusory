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
  const handler = () => {}
  const targets = [document]

  it('Adds handlers', () => {
    ScrollManager.add(targets, handler)

    expect(ScrollManager.managers.get(document)!.handlers[0]).toEqual({
      dependencies: targets,
      handler
    })
  })

  it('Added the event listener to document', () => {
    expect(documentHasScrollListener).toBe(true)
  })

  it('Removes handlers', () => {
    ScrollManager.remove(targets, handler)

    expect(ScrollManager.managers.get(document)).toBeUndefined()
  })

  it('Removed the event listener from document', () => {
    expect(documentHasScrollListener).toBe(false)
  })
})
