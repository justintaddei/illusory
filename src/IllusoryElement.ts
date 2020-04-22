import borderRadiusHandler from './deltaHandlers/borderRadiusHandler'
import { DELTA_PASS_THROUGH_HANDLER, getDelta, IDeltaHandlerMap } from './deltaHandlers/delta'
import transformHandler from './deltaHandlers/transformHandler'
import { DEFAULT_OPTIONS, IOptions } from './options'
import { parseRGBA } from './parsers/parseRGBA'
import duplicateNode from './utils/duplicateNode'
import flushCSSUpdates from './utils/flushCSSUpdates'
import { buildTransitionString } from './utils/transition'

export class IllusoryElement {
  private initalStyleAttributeValue?: string | null
  private orignalStyle: { [prop: string]: string } = {}

  /**
   * DeltaHandlerFunction that transform styles to their new states based on an IDetla
   */
  private deltaHandlers: IDeltaHandlerMap = {
    transform: transformHandler,
    borderTopLeftRadius: borderRadiusHandler,
    borderTopRightRadius: borderRadiusHandler,
    borderBottomRightRadius: borderRadiusHandler,
    borderBottomLeftRadius: borderRadiusHandler
  }

  /**
   * The original `HTMLElement`
   */
  original: HTMLElement

  /**
   * The copy of `IllusoryElement.el` that is used to morph
   */
  clone: HTMLElement

  /**
   * The BoundingClientRect of `this.el`
   */
  rect: DOMRect

  /**
   * Returns `true` if the background-color has an alpha channel `< 1`
   */
  _hasTransparentBackground() {
    const rgba = parseRGBA(this.getStyle('backgroundColor'))
    if (!rgba) return false

    return rgba.a !== 1
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
   * Appends `this.clone` as a child of `element`
   * and hides the "real" element
   * @param element The parent element
   */
  _setParent(element: HTMLElement) {
    this.hideOriginal()
    element.appendChild(this.clone)
  }

  constructor(
    el: HTMLElement,
    options?: { includeChildren?: boolean; zIndex?: number; deltaHandlers?: IDeltaHandlerMap }
  ) {
    // Apply delta overrides
    if (options?.deltaHandlers)
      for (const handler in options.deltaHandlers)
        this.deltaHandlers[handler] = options.deltaHandlers[handler]
          ? options.deltaHandlers[handler]
          : DELTA_PASS_THROUGH_HANDLER

    console.log('options?.deltaHandlers :', this.deltaHandlers)
    this.original = el

    // Save the current value of the style attribute for later
    this.initalStyleAttributeValue = this.original.getAttribute('style')

    this.rect = this.original.getBoundingClientRect()

    this.clone = duplicateNode(this.original, options?.includeChildren ?? DEFAULT_OPTIONS.includeChildren)

    this.setStyle('zIndex', options?.zIndex ?? DEFAULT_OPTIONS.zIndex)

    // Prepare the style for the clone
    this.setStyle('contain', 'strict')
    this.setStyle('opacity', '1')
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

    // Fix for IE when the element has padding.
    // It doesn't break anything so we'll do it everytime
    this.setStyle('width', this.rect.width)
    this.setStyle('height', this.rect.height)

    // Hide the "real" element
    this.original.style.transition = 'none'
    this.original.style.animation = 'none'
  }
  /**
   * Returns the orignal style value for `property`
   */
  getStyle(property: string) {
    return this.orignalStyle[property] ?? this.clone.style[property]
  }
  /**
   * Sets the given css style
   * @param property A CSS property name in camelCase
   */
  setStyle(property: string, value: string | number) {
    this.orignalStyle[property] = this.getStyle(property)
    this.clone.style[property] = value
  }

  /**
   * Returns a `Promise` that is resolved when `transitionend` event is fired for a given `property`
   */
  waitFor(property: string): Promise<void> {
    return new Promise(resolve => {
      const cb = (e: TransitionEvent) => {
        if (property !== 'any' && e.propertyName !== property) return

        this.clone.removeEventListener('transitionend', cb)
        resolve()
      }

      this.clone.addEventListener('transitionend', cb)
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
  hideOriginal() {
    this.original.style.opacity = '0'
  }
  /**
   * Sets the "real" element's opacity to 1
   */
  showOriginal() {
    this.original.style.opacity = '1'
  }

  /**
   * Forces the browser to synchronously update any
   * queued style changes
   */
  flushCSS() {
    flushCSSUpdates(this)
  }

  /**
   * Clean up and finish the transition
   */
  detach() {
    this.showOriginal()

    // Make sure that if `this.el` has a transition on opacity, it isn't applied until after the opacity is reset
    this.flushCSS()

    // Reset `this.el' style attribute
    if (!this.initalStyleAttributeValue) this.original.removeAttribute('style')
    else this.original.setAttribute('style', this.initalStyleAttributeValue)

    this.clone.remove()
  }
}
