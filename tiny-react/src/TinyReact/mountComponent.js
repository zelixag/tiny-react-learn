import isFunction from "./isFunction";
import isFunctionComponent from "./isFunctionComponent";
import mountNativeElement from "./mountNativeElement";

export default function mountComponent(virtualDOM, container) {
  let nextVirtualDOM = null
  // 判断组件是类组件还是函数组件
  if(isFunctionComponent(virtualDOM)) {
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM);
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
  }

  if(isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container);
  } else {
    mountNativeElement(nextVirtualDOM, container);
  }
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {});
}
function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(virtualDOM.props || {});
  const nextVirtualDOM = component.render()
  return nextVirtualDOM
}