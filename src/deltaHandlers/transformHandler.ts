import { IDelta } from './delta'

export default function transformHandler(delta: IDelta) {
  return `translate(${delta.x}px,${delta.y}px) scale(${delta.scaleX}, ${delta.scaleY})`
}
