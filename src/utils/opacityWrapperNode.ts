import { IOptions } from '../options'

export function createOpacityWrapper(startOpacity: string, options: IOptions) {
  const wrapper = document.createElement('div')

  wrapper.style.position = 'fixed'

  wrapper.style.zIndex = options.zIndex.toString()
  wrapper.style.opacity = startOpacity
  wrapper.style.transition = `opacity ${options.duration} ${options.easing} 0s`

  document.body.appendChild(wrapper)

  return wrapper
}
