type ScrollTarget = Document | HTMLElement

interface ScrollDelta {
  x: number
  y: number
}

export type ScrollHandler = (delta: ScrollDelta) => void

class ScrollManager {
  static lastTarget: ScrollTarget
  static debounce: boolean = false
  static managers = new Map<ScrollTarget, ScrollManager>()
  static getCumulativeDelta(targets: ScrollTarget[]) {
    const delta: ScrollDelta = {
      x: 0,
      y: 0
    }

    ScrollManager.managers.forEach((manager, target) => {
      if (!targets.includes(target)) return

      const { x, y } = manager.delta

      delta.x += x
      delta.y += y
    })

    return delta
  }

  static scrollHandler({ target }: Event) {
    ScrollManager.lastTarget = target as ScrollTarget

    if (ScrollManager.debounce) return

    ScrollManager.debounce = true

    requestAnimationFrame(() => {
      ScrollManager.debounce = false

      ScrollManager.managers.get(ScrollManager.lastTarget as ScrollTarget)!.activate()
    })
  }

  static add(targets: ScrollTarget[], handler: ScrollHandler) {
    if (!ScrollManager.managers.size) document.addEventListener('scroll', ScrollManager.scrollHandler, true)

    targets.forEach(target => {
      if (ScrollManager.managers.has(target)) ScrollManager.managers.get(target)!.addHandler(targets, handler)
      else new ScrollManager(target).addHandler(targets, handler)
    })
  }

  static remove(targets: ScrollTarget[], handler: ScrollHandler) {
    targets.forEach(target => {
      if (!ScrollManager.managers.has(target)) return

      const { handlers } = ScrollManager.managers.get(target)!

      if (handlers.length > 1) {
        let index: number = -1

        for (let i = 0; i < handlers.length; i++) {
          const { handler: h } = handlers[i]
          if (h === handler) {
            index = i
            break
          }
        }

        if (index === -1) return

        handlers.splice(index, 1)
      } else ScrollManager.managers.delete(target)
    })

    if (!ScrollManager.managers.size) document.removeEventListener('scroll', ScrollManager.scrollHandler, true)
  }

  target: ScrollTarget
  originalPosition: { x: number; y: number }
  cache: ScrollDelta | null = null

  handlers: {
    dependencies: ScrollTarget[]
    handler: ScrollHandler
  }[] = []

  get currentPosition() {
    return {
      x: this.target instanceof Document ? window.scrollX : this.target.scrollLeft,
      y: this.target instanceof Document ? window.scrollY : this.target.scrollTop
    }
  }

  get delta() {
    if (this.cache) return this.cache

    const delta = {
      x: this.originalPosition.x - this.currentPosition.x,
      y: this.originalPosition.y - this.currentPosition.y
    }

    this.cache = delta

    return delta
  }

  addHandler(dependencies: ScrollTarget[], handler: ScrollHandler) {
    this.handlers.push({
      dependencies,
      handler
    })
  }

  constructor(target: ScrollTarget) {
    this.target = target

    this.originalPosition = this.currentPosition

    ScrollManager.managers.set(target, this)
  }

  activate() {
    this.cache = null

    this.handlers.forEach(({ dependencies, handler }) => {
      handler(ScrollManager.getCumulativeDelta(dependencies))
    })
  }
}

export default ScrollManager
