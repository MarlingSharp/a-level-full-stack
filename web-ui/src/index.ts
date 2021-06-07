function component() {
  const element = document.createElement("div");

  element.innerHTML = ["Hello", "TypeScript", "webpack"].join(' ');

  return element;
}

document.body.appendChild(component());
