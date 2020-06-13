import borderRadiusHandler from './deltaHandlers/borderRadiusHandler'
import { DELTA_PASS_THROUGH_HANDLER, getDelta, IDeltaHandlerMap } from './deltaHandlers/delta'
import transformHandler from './deltaHandlers/transformHandler'
import { DEFAULT_OPTIONS, IOptions } from './options'
import { parseRGBA } from './parsers/parseRGBA'
import { CloneProcessorFunction, duplicateNode, FilterFunction } from './utils/duplicateNode'
import flushCSSUpdates from './utils/flushCSSUpdates'
import { buildTransitionString } from './utils/transition'

interface IIllusoryElementOptions {
  /**
   * If `true`, `this.attach()` is invoked as soon as the instance is created.
   * @default false
   */
  autoAttach?: boolean
  includeChildren?: boolean
  /**
   * If `false` the element we're transitioning **to** has a transparent background then
   * the element we're transitioning from will fade out.
   * If `true` the transparency of the elements background will be ignored.
   *
   * This can also be an array of tag names which should be ignored (e.g. `['img', 'button']`).
   * @default ['img']
   */
  ignoreTransparency?: boolean | string[]
  zIndex?: number
  deltaHandlers?: IOptions['deltaHandlers']
  preserveDataAttributes?: boolean | FilterFunction
  processClone?: CloneProcessorFunction
}

export class IllusoryElement {
  private initialStyleAttributeValue?: string | null
  private originalStyle: { [prop: string]: string } = {}

  /**
   * DeltaHandlerFunction that transform styles to their new states based on an IDelta
   */
  private deltaHandlers: IDeltaHandlerMap = {
    transform: transformHandler,
    borderTopLeftRadius: borderRadiusHandler,
    borderTopRightRadius: borderRadiusHandler,
    borderBottomRightRadius: borderRadiusHandler,
    borderBottomLeftRadius: borderRadiusHandler
  }

  /**
   * The original element
   */
  natural: HTMLElement | SVGElement

  /**
   * The copy of `IllusoryElement.el` that is used to morph
   */
  clone: HTMLElement | SVGElement

  /**
   * The BoundingClientRect of `this.el`
   */
  rect: DOMRect

  /**
   * Whether or not the clone is appended to the DOM
   */
  isAttached = false

  _shouldIgnoreTransparency: IIllusoryElementOptions['ignoreTransparency']

  /**
   * Returns `true` if the background-color has an alpha channel `< 1`
   */
  _hasTransparentBackground() {
    if (this._shouldIgnoreTransparency === true) return false

    if (
      Array.isArray(this._shouldIgnoreTransparency) &&
      this._shouldIgnoreTransparency.indexOf(this.clone.tagName.toLowerCase()) !== -1
    )
      return false

    const rgba = parseRGBA(this.getStyle('backgroundColor'))
    if (!rgba) return false

    return rgba.a < 1
  }

  /**
   * Repositions this `IllusoryElement` over another `IllusoryElement`
   */
  _to(element: IllusoryElement) {
    const delta = getDelta(this, element)
    Object.keys(this.deltaHandlers).forEach(key => {
      this.setStyle(key, this.deltaHandlers[key](delta, element.getStyle(key), this.getStyle(key)))
    })
  }

  /**
   * Sets the CSS transitions
   */
  _enableTransitions(options: IOptions) {
    this.setStyle('transition', buildTransitionString(options))
  }

  /**
   * Removes the CSS transitions
   */
  _disableTransitions() {
    this.setStyle('transition', 'none')
  }

  /**
   * Appends `this.clone` as a child of `element`
   * and hides the "real" element
   * @param element The parent element
   */
  _setParent(element: HTMLElement | SVGElement) {
    if (this.isAttached) this.detach()

    this.hideNatural()
    element.appendChild(this.clone)

    this.isAttached = true
  }

  constructor(el: HTMLElement | SVGElement, options?: IIllusoryElementOptions) {
    // Apply delta overrides
    if (options?.deltaHandlers) {
      for (const prop in options.deltaHandlers) {
        if (options.deltaHandlers.hasOwnProperty(prop)) {
          const handler = options.deltaHandlers[prop]
          this.deltaHandlers[prop] = typeof handler === 'function' ? handler : DELTA_PASS_THROUGH_HANDLER
        }
      }
    }

    this._shouldIgnoreTransparency = options?.ignoreTransparency

    this.natural = el

    // Save the current value of the style attribute for later
    this.initialStyleAttributeValue = this.natural.getAttribute('style')

    this.rect = this.natural.getBoundingClientRect()

    this.clone = duplicateNode(this.natural, {
      includeChildren: options?.includeChildren ?? DEFAULT_OPTIONS.includeChildren,
      preserveDataAttributes: options?.preserveDataAttributes,
      processClone: options?.processClone
    }) as HTMLElement | SVGElement

    this.setStyle('zIndex', options?.zIndex ?? DEFAULT_OPTIONS.zIndex)

    // Prepare the style for the clone
    this.setStyle('left', 'auto')
    this.setStyle('right', 'auto')
    this.setStyle('top', 'auto')
    this.setStyle('bottom', 'auto')
    this.setStyle('margin', '0 0 0 0')
    this.setStyle('transformOrigin', '0 0')
    this.setStyle('transform', 'none')
    this.setStyle('transition', 'none')
    this.setStyle('animation', 'none')
    this.setStyle('pointerEvents', 'none')
    // This will overlay the clone on top of `this.el`
    this.setStyle('position', 'fixed')
    this.setStyle('left', `${this.rect.left}px`)
    this.setStyle('top', `${this.rect.top}px`)

    // Hide the "real" element
    this.natural.style.transition = 'none'
    this.natural.style.animation = 'none'

    if (options?.autoAttach) this.attach()
  }
  /**
   * Returns the original style value for `property`
   */
  getStyle(property: string) {
    return this.originalStyle[property] ?? this.clone.style[property]
  }
  /**
   * Sets the given css style
   * @param property A CSS property name in camelCase
   */
  setStyle(property: string, value: string | number) {
    this.originalStyle[property] = this.getStyle(property)
    this.clone.style[property] = value
  }

  /**
   * Returns a `Promise` that is resolved when `transitionend` event is fired for a given `property`
   */
  waitFor(property: string): Promise<void> {
    return new Promise(resolve => {
      const cb = async (e: TransitionEvent) => {
          if (property !== 'any' && e.propertyName !== property) return

          // Wait a from so any other transitionend events have time to fire
          if (property === 'any') await new Promise(r => requestAnimationFrame(r))
          ;(this.clone as HTMLElement).removeEventListener('transitionend', cb)
          resolve()
        }

        // TODO figure out why TypeScript is complaining about this event listener
      ;(this.clone as HTMLElement).addEventListener('transitionend', cb)
    })
  }
  /**
   * Sets the clone's opacity to 0
   */
  hide() {
    this.setStyle('opacity', '0')
  }
  /**
   * Sets the clone's opacity to 1
   */
  show() {
    this.setStyle('opacity', '1')
  }

  /**
   * Sets the "real" element's opacity to 0
   */
  hideNatural() {
    this.natural.style.opacity = '0'
  }
  /**
   * Sets the "real" element's opacity to 1
   */
  showNatural() {
    this.natural.style.opacity = '1'
  }

  /**
   * Forces the browser to synchronously update any
   * queued style changes
   */
  flushCSS() {
    flushCSSUpdates(this)
  }

  /**
   * Appends `this.clone` as a child of `element`
   * and hides the "real" element
   * @param element The parent element
   */
  attach() {
    this._setParent(document.body)
  }

  /**
   * Clean up and finish the transition
   */
  detach() {
    if (!this.isAttached) return

    this.showNatural()

    // Make sure that if `this.el` has a transition on opacity, it isn't applied until after the opacity is reset
    this.flushCSS()

    // Reset `this.el' style attribute
    if (!this.initialStyleAttributeValue) this.natural.removeAttribute('style')
    else this.natural.setAttribute('style', this.initialStyleAttributeValue)

    this.clone.remove()

    this.isAttached = false
  }
}
