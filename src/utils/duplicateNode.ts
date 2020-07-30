export type FilterFunction = (attributeName: string) => boolean
export type CloneProcessorFunction = (node: Node, depth: number) => Node | void

interface ICloneOptions {
  includeChildren?: boolean
  preserveDataAttributes?: boolean | FilterFunction
  processClone?: CloneProcessorFunction
}

const isHTMLOrSVG = (node: Node): node is HTMLElement | SVGAElement =>
  node instanceof HTMLElement || node instanceof SVGElement

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
 * Clones an element, with it's computed styles applied inline, and optionally it's children
 * @param includeChildren Whether or not to also include the `element`s children
 */
export function duplicateNode(node: Node, options: ICloneOptions, depth = 0) {
  let clone = node.cloneNode(false)

  // If it's not a TextNode or something.
  if (isHTMLOrSVG(node)) {
    copyStyles(node, clone as typeof node)

    if (options.preserveDataAttributes !== true)
      filterDataAttributes(clone as typeof node, options.preserveDataAttributes)
  }

  if (typeof options.processClone === 'function') {
    const processedClone = options.processClone(clone, depth)

    if (processedClone) clone = processedClone
    else return null
  }

  if (options.includeChildren) {
    node.childNodes.forEach(child => {
      const duplicatedNode = duplicateNode(child, options, depth + 1)

      if (duplicatedNode) clone.appendChild(duplicatedNode)
    })
  }

  return clone
}
