import createDOMElement from "./createDOMElement";

export default function mountNativeElement(virtualDOM, container, oldDOM) {
  let newElement = createDOMElement(virtualDOM);

  if(oldDOM) {
    container.insertBefore(newElement, oldDOM)
  } else {
    container.appendChild(newElement);
  }

  
}
