import { fireEvent, getByRole, waitFor } from '@testing-library/dom';
import Select, { SelectParams } from '../src/select';

describe('select', () => {
  const selectOptions = [
    {
      label: 'red',
      value: 'red'
    },
    {
      label: 'blue',
      value: 'blue'
    },
    {
      label: 'orange',
      value: 'orange'
    }
  ];
  let container: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root"></div>
    `;
    container = document.querySelector('#root') as HTMLElement;
  });

  test('render', () => {
    const options: SelectParams = {
      container,
      props: {
        selectOptions
      }
    };
    const { container: _container } = new Select(options);
    expect(getByRole(_container, 'select')).toBeInTheDocument();
  });

  test('with placeholder', () => {
    const placeholder = 'select a color...';
    const options: SelectParams = {
      container,
      props: {
        selectOptions,
        placeholder
      }
    };
    const { container: _container } = new Select(options);
    const selectElement = getByRole(_container, 'select');
    expect(selectElement.querySelector('.syui-select__value')?.textContent).toBe(placeholder);
  });

  test('click and open options', async () => {
    const Options: SelectParams = {
      container,
      props: { selectOptions }
    };
    const { container: _container } = new Select(Options);
    const selectElement = getByRole(_container, 'select');
    const selectLabel = selectElement.querySelector('.syui-select__value') as HTMLElement;
    fireEvent.mouseDown(selectLabel);

    await waitFor(() => {
      const selectElement = getByRole(_container, 'select');
      const optionsElement = selectElement.querySelector('.syui-select__options') as HTMLElement;
      expect(optionsElement).toBeInTheDocument();
    });
  });
});
