import { IllusoryElement } from './IllusoryElement'
import flushCSSUpdates from './utils/flushCSSUpdates'
import { IOptions, DEFAULT_OPTIONS } from './options'
import { createOpacityWrapper } from './utils/opacityWrapperNode'
import './polyfill/String.startsWith'
import './polyfill/Element.remove'
import './polyfill/NodeList.forEach'

class ScrollManager {
  target: HTMLElement | Window
  private originalPosition: { x: number; y: number }

  handler: (e: Event) => void

  constructor(target: HTMLElement | Window, handler: (e: Event) => void) {
    this.target = target
    this.handler = handler

    this.originalPosition = this.currentPosition
  }

  get currentPosition() {
    return {
      x: 'scrollLeft' in this.target ? this.target.scrollLeft : this.target.scrollX,
      y: 'scrollTop' in this.target ? this.target.scrollTop : this.target.scrollY
    }
  }

  get delta() {
    return {
      x: this.originalPosition.x - this.currentPosition.x,
      y: this.originalPosition.y - this.currentPosition.y
    }
  }
}

function getCumulativeScrollDelta(scrollManagers: Map<HTMLElement | Window, ScrollManager>) {
  const managers = [...scrollManagers.values()]

  return {
    x: managers.map(s => s.delta.x).reduce((p, c) => p + c, 0),
    y: managers.map(s => s.delta.y).reduce((p, c) => p + c, 0)
  }
}

function createIllusoryElement(element: HTMLElement | IllusoryElement, options: IOptions): IllusoryElement {
  let illusoryElement: IllusoryElement

  if (element instanceof IllusoryElement) {
    illusoryElement = element

    if (options.deltaHandlers) illusoryElement._appendDeltaHandlers(options.deltaHandlers)
  } else illusoryElement = new IllusoryElement(element, options)

  return illusoryElement
}

/**
 * Morph one element to another
 * @param from The element to morph from
 * @param to The element to morph to
 */
async function illusory(
  from: HTMLElement | IllusoryElement,
  to: HTMLElement | IllusoryElement,
  options?: Partial<IOptions>
) {
  const completeOptions: IOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  }
  if (completeOptions.compositeOnly) {
    if (!completeOptions.deltaHandlers) completeOptions.deltaHandlers = {}

    const nonCompositeProperties = [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomLeftRadius',
      'borderBottomRightRadius'
    ]

    // Don't override user-provided handlers
    for (const prop of nonCompositeProperties)
      if (!completeOptions.deltaHandlers[prop]) completeOptions.deltaHandlers[prop] = false
  }

  // Convert the `HTMLElement` to Illusory if needed.
  const start = createIllusoryElement(from, completeOptions)
  const end = createIllusoryElement(to, completeOptions)

  const startOpacity = start.getStyle('opacity')
  const endOpacity = end.getStyle('opacity')

  // We to append the clones to a wrapper element if the opacity is less than 1
  // or there will be a "pop" at the start and end
  const needsWrapperElement = startOpacity !== '1' || endOpacity !== '1' || completeOptions.relativeTo.length > 0

  const parent = needsWrapperElement ? createOpacityWrapper(startOpacity, completeOptions) : document.body
  const scrollHandlers = new Map<HTMLElement | Window, ScrollManager>()

  completeOptions.relativeTo.forEach(target => {
    const handler = () => {
      const delta = getCumulativeScrollDelta(scrollHandlers)

      console.log('delta :>> ', delta)

      parent.style.transform = `translate(${delta.x}px, ${delta.y}px)`
    }

    scrollHandlers.set(target, new ScrollManager(target, handler))

    // TODO: use rAF
    target.addEventListener('scroll', handler, true)
  })

  // beforeAnimate hook
  if (typeof options?.beforeAttach === 'function') {
    await Promise.resolve(options.beforeAttach(start, end))
  }

  start.setStyle('opacity', 1)
  end.setStyle('opacity', 1)

  start._setParent(parent)
  end._setParent(parent)

  end.hide()
  end._to(start)

  // beforeAnimate hook
  if (typeof options?.beforeAnimate === 'function') {
    await Promise.resolve(options.beforeAnimate(start, end))
  }

  start._enableTransitions(completeOptions)
  end._enableTransitions(completeOptions)

  flushCSSUpdates(start, end)

  start._to(end)
  end._to(end)

  // If the`end` element has a transparent or semi-transparent
  // background, we have to fade out the `start` element because otherwise it will be visible
  // until it is removed from the dom causing a weird
  // "pop" effect.
  if (!end._ignoreTransparency && (end._hasTransparentBackground() || completeOptions.compositeOnly)) start.hide()
  end.show()

  if (needsWrapperElement) parent.style.opacity = endOpacity

  await end.waitFor('any')

  if (typeof options?.beforeDetach === 'function') {
    start._disableTransitions()
    end._disableTransitions()
    start.hide()
    await Promise.resolve(options.beforeDetach(start, end))
  }

  start.detach()
  end.detach()

  if (needsWrapperElement) {
    parent.remove()

    scrollHandlers.forEach(({ handler }, target) => {
      target.removeEventListener('scroll', handler, true)
    })
  }
}

export { illusory, IllusoryElement }
