import diff from './diff'
import mountElement from './mountElement'
export default function render(virtualDOM, container, oldDOM) {
  // 判断是否有oldDOM
  if(!oldDOM) {
    // 是普通的virtualDOM对象还是组件形式的virtualDOM对象
    mountElement(virtualDOM, container)
  }
}