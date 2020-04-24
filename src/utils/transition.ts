import { IOptions } from '../options'

export function buildTransitionString(options: IOptions) {
  if (options.compositeOnly)
    return `transform ${options.duration} ${options.easing} 0s, opacity ${options.duration} ${options.easing} 0s`
  else return `all ${options.duration} ${options.easing} 0s`
}
