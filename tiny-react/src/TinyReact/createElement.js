export default function createElement (type, props, ...children) {
  // 如果说是刨除某些节点，我们就不能使用map了，我们可以使用reduce
  const childElements = [].concat(...children).reduce((result, child) => {
    if(child !== true && child !== false && child !== null)  {
      if(child instanceof Object) {
        result.push(child)
      } else {
        result.push(createElement("text", {textContent: child}));
      }
    }
    return result;
  }, [])
  return {
    type,
    props: Object.assign({children: childElements}, props),
    children: childElements
  }
}