import borderRadiusHandler from './deltaHandlers/borderRadiusHandler'
import { getDelta, IDeltaHandlerMap, DELTA_PASS_THROUGH_HANDLER } from './deltaHandlers/delta'
import transformHandler from './deltaHandlers/transformHandler'
import { DEFAULT_OPTIONS, IIllusoryElementOptions, IIllusoryOptions } from './options'
import { parseRGBA } from './parsers/parseRGBA'
import { duplicateNode } from './utils/duplicateNode'
import flushCSSUpdates from './utils/flushCSSUpdates'
import { buildTransitionString } from './utils/transition'

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
  _makeCompositeOnly() {
    this.deltaHandlers = {
      transform: transformHandler,
      borderTopLeftRadius: DELTA_PASS_THROUGH_HANDLER,
      borderTopRightRadius: DELTA_PASS_THROUGH_HANDLER,
      borderBottomLeftRadius: DELTA_PASS_THROUGH_HANDLER,
      borderBottomRightRadius: DELTA_PASS_THROUGH_HANDLER
    }
  }

  /**
   * The original element
   */
  natural: HTMLElement | SVGElement

  /**
   * The clone of `this.natural`
   */
  clone: HTMLElement | SVGElement

  /**
   * The BoundingClientRect of `this.natural`
   */
  rect: DOMRect

  /**
   * Whether or not the clone is appended to the DOM
   */
  isAttached = false

  _shouldIgnoreTransparency: IIllusoryElementOptions['ignoreTransparency']

  get _ignoreTransparency() {
    if (this._shouldIgnoreTransparency === true) return true

    if (
      Array.isArray(this._shouldIgnoreTransparency) &&
      this._shouldIgnoreTransparency.indexOf(this.clone.tagName.toLowerCase()) !== -1
    )
      return true

    return false
  }

  /**
   * Returns `true` if the background-color has an alpha channel `< 1`
   */
  _hasTransparentBackground() {
    if (this._ignoreTransparency) return false

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
  _enableTransitions(options: IIllusoryOptions) {
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

  /**
   * Reset `this.natural`'s style attribute
   */
  private _resetNaturalStyleAttribute() {
    if (!this.initialStyleAttributeValue) this.natural.removeAttribute('style')
    else this.natural.setAttribute('style', this.initialStyleAttributeValue)
  }

  constructor(el: HTMLElement | SVGElement, options?: Partial<IIllusoryElementOptions>) {
    this.natural = el

    // Save the current value of the style attribute for later
    this.initialStyleAttributeValue = this.natural.getAttribute('style')

    this._shouldIgnoreTransparency = options?.ignoreTransparency ?? DEFAULT_OPTIONS.element.ignoreTransparency

    this.natural.style.transition = 'none'
    this.natural.style.animation = 'none'

    {
      const originalNaturalTransform = this.natural.style.transform
      this.natural.style.transform = 'none'
      this.rect = this.natural.getBoundingClientRect()
      this.natural.style.transform = originalNaturalTransform
    }

    this.clone = duplicateNode(this.natural, {
      includeChildren: options?.includeChildren ?? DEFAULT_OPTIONS.element.includeChildren,
      preserveDataAttributes: options?.preserveDataAttributes,
      processClone: options?.processClone
    }) as HTMLElement | SVGElement

    // Prepare the style for the clone
    this.setStyle('left', 'auto')
    this.setStyle('right', 'auto')
    this.setStyle('top', 'auto')
    this.setStyle('bottom', 'auto')
    this.setStyle('margin', '0 0 0 0')
    this.setStyle('transition', 'none')
    this.setStyle('animation', 'none')
    this.setStyle('pointerEvents', 'none')
    // This will overlay the clone on top of `this.el`
    this.setStyle('position', 'fixed')
    this.setStyle('left', `${this.rect.left}px`)
    this.setStyle('top', `${this.rect.top}px`)

    if (options?.attachImmediately) this.attach()
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

          // Wait a frame so any other transitionend events have time to fire
          if (property === 'any') await new Promise(r => requestAnimationFrame(r))
          ;(this.clone as HTMLElement).removeEventListener('transitionend', cb)
          resolve()
        }

        // TODO figure out why TypeScript is complaining about these event listener
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
   * Appends the clone as a child of `document.body`
   * and hides the "natural" element.
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

    this._resetNaturalStyleAttribute()

    this.clone.remove()

    this.isAttached = false
  }
}
