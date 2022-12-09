import select from './demos/select';
const rootElement = document.querySelector('#root') as HTMLElement;
const selectBox = select(rootElement);

document.querySelector('button')?.addEventListener('click', () => {
  if (!selectBox.state.selected) return;
  const value = document.querySelector('#value') as HTMLElement;
  value.textContent = selectBox.state.selected?.label + ':' + selectBox.state.selected?.value;
});
