type ScrollTarget = Document | HTMLElement

interface IScrollPosition {
  x: number
  y: number
}

export interface IScrollListener {
  dependencies: ScrollTarget[]
  handler: (delta: IScrollPosition) => void
}

const targetManagers = new Map<ScrollTarget, TargetManager>()

class TargetManager {
  static getCumulativeDelta(listener: IScrollListener) {
    return listener.dependencies.reduce(
      ({ x, y }, target) => {
        const delta = targetManagers.get(target)!.getDelta(listener)

        return {
          x: x + delta.x,
          y: y + delta.y
        }
      },
      { x: 0, y: 0 }
    )
  }

  private target: ScrollTarget
  private listeners: IScrollListener[] = []
  private initialPositions = new Map<IScrollListener, IScrollPosition>()

  private get currentPosition(): IScrollPosition {
    return {
      x: this.target instanceof Document ? window.scrollX : this.target.scrollLeft,
      y: this.target instanceof Document ? window.scrollY : this.target.scrollTop
    }
  }

  private getDelta(listener: IScrollListener) {
    const initialPosition = this.initialPositions.get(listener)!
    const currentPosition = this.currentPosition

    return {
      x: initialPosition.x - currentPosition.x,
      y: initialPosition.y - currentPosition.y
    }
  }

  constructor(target: ScrollTarget, listener: IScrollListener) {
    this.target = target

    this.add(listener)
  }

  get listenerCount(): number {
    return this.listeners.length
  }

  add(listener: IScrollListener) {
    this.listeners.push(listener)
    this.initialPositions.set(listener, this.currentPosition)
  }

  remove(listener: IScrollListener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1)
    this.initialPositions.delete(listener)
  }

  dispatch() {
    this.listeners.forEach(listener => {
      const delta = TargetManager.getCumulativeDelta(listener)

      listener.handler(delta)
    })
  }
}

// const latestTarget
let debounce = false
const scrollHandler = (e: Event) => {
  if (debounce) return

  debounce = true

  requestAnimationFrame(() => {
    debounce = false

    const target = e.target as ScrollTarget

    if (!targetManagers.has(target)) return

    targetManagers.get(target)!.dispatch()
  })
}

export default {
  add(listener: IScrollListener) {
    listener.dependencies.forEach(target => {
      if (!targetManagers.size) document.addEventListener('scroll', scrollHandler, true)

      if (targetManagers.has(target)) targetManagers.get(target)!.add(listener)
      else targetManagers.set(target, new TargetManager(target, listener))
    })
  },
  remove(listener: IScrollListener) {
    listener.dependencies.forEach(target => {
      const manager = targetManagers.get(target)!

      manager.remove(listener)

      if (!manager.listenerCount) targetManagers.delete(target)
    })

    if (!targetManagers.size) document.removeEventListener('scroll', scrollHandler, true)
  }
}
