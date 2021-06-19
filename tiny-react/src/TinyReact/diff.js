import createDOMElement from "./createDOMElement";
import mountElement from "./mountElement";
import updateNodeElement from "./updateNodeElement";
import updateTextNode from "./updateTextNode";
import unmountNode from "./unmountNode"
import diffComponent from "./diffComponent";

export default function diff (virtualDOM, container, oldDOM) {
  const oldVirtualDOM= oldDOM && oldDOM._virtualDOM
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component
  // 判断是否有oldDOM
  if (!oldDOM) {
    // 是普通的virtualDOM对象还是组件形式的virtualDOM对象
    mountElement(virtualDOM, container);
  } else if (
    // 如果要比对的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件，
    typeof virtualDOM.type !== "function") {
      const newElement = createDOMElement(virtualDOM)
      oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (typeof virtualDOM.type === "function") {
    // 组件
    diffComponent(virtualDOM, oldComponent, oldDOM, container)
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    if (virtualDOM.type === "text") {
      // 更新内容
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM);
    } else {
      // 更新元素属性
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM);
    }

    // 1. 将拥有key属性的子元素放置在一个单独的对象中
    let keyedElements = {}
    for(let i = 0, len = oldDOM.childNodes.length;i< len;i++) {
      let domElement = oldDOM.childNodes[i]
      // 是元素节点才获取key值
      if(domElement.nodeType === 1) {
        let key = domElement.getAttribute("key")
        if(key) {
          keyedElements[key] = domElement
        }
      }

    }

    let hasNoKey = Object.keys(keyedElements).length === 0
    if(hasNoKey) {
      // 循环递归子节点，继续调用diff方法，比对子元素进行更新
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i]);
      });
    } else {
      // 2. 循环 VirtualDOM 的子元素 获取子元素的 key属性

      virtualDOM.children.forEach((child, i) => {
        let key = child.props.key + ''
        if(key) {
          let domElement = keyedElements[key]
          if(domElement) {
            // 3.看看当前位置的元素是不是我们期望的元素
            if(oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
              oldDOM.insertBefore(domElement, oldDOM.childNodes[i])
            }
          } else {
            // 新增元素
            mountElement(child, oldDOM, oldDOM.childNodes[i])
          }
        }
      })
    }
    // 删除节点
    //  获取旧节点的数量

    let oldChildNodes = oldDOM.childNodes;

    // 如果纠结点的数量多于要渲染的新节点的长度
    if (oldChildNodes.length > virtualDOM.children.length) {
      if (hasNoKey) {
        // 有节点需要被删除
        for (
          let i = oldChildNodes.length - 1;
          i > virtualDOM.children.length - 1;
          i--
        ) {
          unmountNode(oldChildNodes[i])
        }
      } else {
        // 通过key属性删除节点
        for(let i = 0; i < oldChildNodes.length; i++) {
          let oldChild = oldChildNodes[i];
          let oldChildKey = oldChild._virtualDOM.props.key;
          let found = false
          for (let n = 0; n<virtualDOM.children.length;n++) {
            if(oldChildKey === virtualDOM.children[n].props.key) {
              found = true;
              break;
            }
          }
          if(!found) {
            unmountNode(oldChild)
          }
        }
      }
    }
  }
}