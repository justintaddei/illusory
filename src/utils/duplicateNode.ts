export type FilterFunction = (attributeName: string) => boolean

interface ICloneOptions {
  includeChildren?: boolean
  preserveDataAttributes?: boolean | FilterFunction
}

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
function filterDataAttributes(element: HTMLElement, filterFunction?: false | FilterFunction) {
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
function copyStyles(source: HTMLElement, target: HTMLElement) {
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
export function duplicateNode(node: HTMLElement, options: ICloneOptions) {
  const clone = node.cloneNode(false) as typeof node

  if (clone.nodeType === Node.ELEMENT_NODE) {
    if (options.includeChildren)
      node.childNodes.forEach(child => clone.appendChild(duplicateNode(child as HTMLElement, options)))

    copyStyles(node, clone)

    if (options.preserveDataAttributes !== true) filterDataAttributes(clone, options.preserveDataAttributes)
  }

  return clone
}
