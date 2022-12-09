export const hasClassInParents = (element: HTMLElement, classname: string) => {
  let target: HTMLElement | null = element;

  while (target) {
    const hasClass = target.classList.contains(classname);
    if (hasClass) return true;
    else target = target.parentElement;
  }

  return false;
};

export const matchSelector = (element: HTMLElement, selector: string) => {
  return Array.prototype.some.call(document.querySelectorAll(selector), (elem) => {
    return element.isEqualNode(elem);
  });
};

export const updateAttributes = (oldNode: HTMLElement, newNode: HTMLElement) => {
  const oldProps = [...oldNode.attributes];
  const newProps = [...newNode.attributes];

  for (const { name, value } of newProps) {
    if (value === oldNode.getAttribute(name)) continue;
    oldNode.setAttribute(name, value);
  }

  for (const { name } of oldProps) {
    if (newNode.getAttribute(name) !== undefined) continue;
    oldNode.removeAttribute(name);
  }
};

export const updateElement = (
  parent: HTMLElement,
  newNode?: HTMLElement,
  oldNode?: HTMLElement,
  index = 0
) => {
  if (newNode && !oldNode) {
    return parent.appendChild(newNode);
  }
  if (!newNode && oldNode) {
    return oldNode.remove();
  }
  if (newNode instanceof Text && oldNode instanceof Text) {
    if (oldNode.nodeValue === newNode.nodeValue) return;
    return (oldNode.nodeValue = newNode.nodeValue);
  }
  if (newNode?.nodeName !== oldNode?.nodeName) {
    oldNode?.remove();
    parent.insertBefore(newNode as Node, parent.children[index + 1]);
    return;
  }
  updateAttributes(oldNode!, newNode!);

  const newChildren = [...newNode!.childNodes];
  const oldChildren = [...oldNode!.childNodes];
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(oldNode!, newChildren[i] as HTMLElement, oldChildren[i] as HTMLElement);
  }
};
