import { IllusoryElement } from '../'
import { IIllusoryOptions } from '../options'
import ScrollManager, { ScrollHandler } from './ScrollManager'

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

  const setPos: ScrollHandler = ({ x, y }) => {
    container.style.transform = `translate(${x}px, ${y}px)`
  }

  document.body.appendChild(container)

  ScrollManager.add(opts.relativeTo, setPos)

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

      start.detach()
      end.detach()

      ScrollManager.remove(opts.relativeTo, setPos)
      container.remove()
    }
  }
}
