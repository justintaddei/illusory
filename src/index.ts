import { IllusoryElement } from './IllusoryElement'
import { DEFAULT_OPTIONS, IOptions } from './options'
import './polyfill/Element.remove'
import './polyfill/NodeList.forEach'
import './polyfill/String.startsWith'
import flushCSSUpdates from './utils/flushCSSUpdates'
import { createOpacityWrapper } from './utils/opacityWrapperNode'
import ScrollManager, { ScrollHandler } from './utils/ScrollManager'

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

  const scrollHandler: ScrollHandler = ({ x, y }) => {
    parent.style.transform = `translate(${x}px, ${y}px)`
  }

  ScrollManager.add(completeOptions.relativeTo, scrollHandler)

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

    ScrollManager.remove(completeOptions.relativeTo, scrollHandler)
  }
}

export { illusory, IllusoryElement }
