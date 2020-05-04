export type FilterFunction = (attributeName: string) => boolean
export type CloneProcessorFunction = (node: Node, depth: number) => Node | void

interface ICloneOptions {
  includeChildren?: boolean
  preserveDataAttributes?: boolean | FilterFunction
  processClone?: CloneProcessorFunction
}

const isHTMLOrSVG = (el: Node) => el instanceof HTMLElement || el instanceof SVGElement

/**
 * Converts a string in camelCase to kebab-case
 */
function toKebab(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()
}

/**
 * Removes any attributes that might have negative effects
 */
function filterDataAttributes(element: HTMLElement | SVGElement, filterFunction?: false | FilterFunction) {
  // Some data-* attributes can cause problems when cloning elements
  // (e.g.Vue's data-v attributes)
  Object.keys(element.dataset).forEach(key => {
    const attr = `data-${toKebab(key)}`

    if (attr.indexOf('data-illusory') === 0) return

    if (!filterFunction || !filterFunction(attr)) element.removeAttribute(attr)
  })
}

/**
 * Copies the computed styles from one element to another
 *
 * Based on Chris Lord's comment here: https://bugzilla.mozilla.org/show_bug.cgi?id=137687#c7
 */
function copyStyles(source: HTMLElement | SVGElement, target: HTMLElement | SVGElement) {
  const styles = window.getComputedStyle(source)

  if (styles.cssText !== '') target.style.cssText = styles.cssText
  // For non-WebKit browsers
  else {
    let mockCssText = ''
    for (let i = 0; i < styles.length; i++) {
      mockCssText += `${styles[i]}: ${styles.getPropertyValue(styles[i])}; `
    }

    target.style.cssText = mockCssText
  }
}

/**
 * Clones an element, with it's computed styles applied inline, and optionally it's childen
 * @param includeChildren Whether or not to also include the `element`s children
 */
export function duplicateNode(node: Node, options: ICloneOptions, depth = 0) {
  const clone = node.cloneNode(false)

  // TODO Figure out why Typescript doesn't recognize this check
  if (isHTMLOrSVG(node)) {
    if (options.includeChildren)
      node.childNodes.forEach(child => clone.appendChild(duplicateNode(child, options, depth + 1)))

    copyStyles(node as HTMLElement | SVGElement, clone as HTMLElement | SVGElement)

    if (options.preserveDataAttributes !== true)
      filterDataAttributes(clone as HTMLElement | SVGElement, options.preserveDataAttributes)
  }

  let cloneOverwrite: Node | void

  if (typeof options.processClone === 'function') cloneOverwrite = options.processClone(clone, depth)

  return cloneOverwrite instanceof Node ? cloneOverwrite : clone
}
