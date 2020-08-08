import { IllusoryElement } from '../'
import { IIllusoryOptions } from '../options'
import ScrollManager, { IScrollListener } from './ScrollManager'

export interface IContainerControls {
  setOpacity(opacity: string): void
  add(start: IllusoryElement, end: IllusoryElement): void
  destroy(start: IllusoryElement, end: IllusoryElement, canceled: boolean): Promise<void>
}

export function createContainer(opts: IIllusoryOptions): IContainerControls {
  const container = document.createElement('div')

  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '0'
  container.style.zIndex = opts.zIndex.toString()
  container.style.transition = `opacity ${opts.duration} ${opts.easing} 0s`

  document.body.appendChild(container)

  const scrollListener: IScrollListener = {
    dependencies: opts.relativeTo,
    handler({ x, y }) {
      container.style.transform = `translate(${x}px, ${y}px)`
    }
  }

  ScrollManager.add(scrollListener)

  return {
    setOpacity(opacity) {
      container.style.opacity = opacity
    },
    add(start, end) {
      ;[start, end].forEach(el => {
        if (opts.compositeOnly) el._makeCompositeOnly()

        el._setParent(container)

        el.setStyle('opacity', 1)
      })
    },
    async destroy(start, end, canceled) {
      if (typeof opts.beforeDetach === 'function') {
        await opts.beforeDetach(start, end, canceled)
      }

      ScrollManager.remove(scrollListener)

      start.detach()
      end.detach()

      container.remove()
    }
  }
}
