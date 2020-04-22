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
function cleanAttributes(element: HTMLElement) {
  // Some data-* attributes can cause problems when cloning elements
  // (e.g.Vue's data-v attributes)
  Object.keys(element.dataset).forEach(key => element.removeAttribute(`data-${toKebab(key)}`))

  element.removeAttribute('class')
  element.removeAttribute('id')
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
export default function duplicateNode(node: HTMLElement, includeChildren = false) {
  const clone = node.cloneNode(false) as typeof node

  if (clone.nodeType === Node.ELEMENT_NODE) {
    if (includeChildren) node.childNodes.forEach(child => clone.appendChild(duplicateNode(child as HTMLElement, true)))

    copyStyles(node, clone)

    cleanAttributes(clone)
  }

  return clone
}
