import { IllusoryElement } from './IllusoryElement'
import { DEFAULT_OPTIONS, IIllusoryElementOptions, IIllusoryOptions } from './options'
import { createContainer, IContainerControls } from './utils/createContainer'
import flushCSSUpdates from './utils/flushCSSUpdates'

/**
 * "Reactive" reference to a cancel method
 */
interface ICancelRef {
  cancel: () => void
}

interface IIllusoryControls {
  /**
   * Resolves when the animation is finished
   * Resolves to `true` if the animation was not canceled
   */
  finished: Promise<boolean>
  /**
   * Immediately cancels the animation
   */
  cancel: () => void
}

type IllusoryTarget = HTMLElement | SVGElement | IllusoryElement

function illusory(from: IllusoryTarget, to: IllusoryTarget, options?: Partial<IIllusoryOptions>): IIllusoryControls {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  const convert = (target: IllusoryTarget) =>
    target instanceof IllusoryElement ? target : new IllusoryElement(target, opts.element)

  const start = convert(from)
  const end = convert(to)

  // Override existing z-index.
  // The `zIndex` option is applied to
  // the container element so this is okay.
  start.setStyle('zIndex', 1)
  end.setStyle('zIndex', 2)

  const container = createContainer(opts)

  container.add(start, end)

  container.setOpacity(start.getStyle('opacity'))

  const ref: ICancelRef = {
    cancel: () => {
      throw new Error('Cancel called before assigned')
    } // Set later in `animate`
  }

  return {
    finished: animate(start, end, container, opts, ref),
    cancel: () => {
      ref.cancel()
    }
  }
}

function animate(
  start: IllusoryElement,
  end: IllusoryElement,
  container: IContainerControls,
  opts: IIllusoryOptions,
  cancelRef: ICancelRef
): Promise<boolean> {
  return new Promise(async finished => {
    let canceled = false
    const cancel = async () => {
      canceled = true
      await container.destroy(start, end, canceled)
      finished(canceled)
    }
    cancelRef.cancel = cancel

    end.hide()
    end._to(start)

    // Before animate hook
    if (typeof opts.beforeAnimate === 'function') await Promise.resolve(opts.beforeAnimate(start, end))

    if (canceled) return

    start._enableTransitions(opts)
    end._enableTransitions(opts)

    flushCSSUpdates(start, end)

    start._to(end)
    end._to(end)

    // If the`end` element has a transparent or semi-transparent
    // background, we have to fade out the `start` element because otherwise it will be visible
    // until it is removed from the DOM. Causing an odd "pop" effect.
    if (!end._ignoreTransparency && (end._hasTransparentBackground() || opts.compositeOnly)) start.hide()

    end.show()

    container.setOpacity(end.getStyle('opacity'))

    await end.waitFor('any')

    if (canceled) return

    await container.destroy(start, end, canceled)
    finished(canceled)
  })
}

export { illusory, IllusoryElement, IIllusoryOptions, IIllusoryElementOptions }
