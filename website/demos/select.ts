import Select, { SelectParams } from '../../src/select';

function createSelect(container: HTMLElement) {
  const selectOptions = [
    {
      label: 'Red',
      value: 'red'
    },
    {
      label: 'Blue',
      value: 'blue'
    },
    {
      label: 'Orange',
      value: 'orange'
    },
    {
      label: 'Purple',
      value: 'purple'
    }
  ];
  const params: SelectParams = {
    container,
    props: {
      selectOptions
    }
  };
  const select: Select = new Select(params);
  return select;
}

export default createSelect;
