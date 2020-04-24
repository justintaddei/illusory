import { IDelta } from './delta'

export default function transformHandler(delta: IDelta) {
  return `translate3d(${delta.x}px,${delta.y}px, 0) scale(${delta.scaleX}, ${delta.scaleY})`
}
