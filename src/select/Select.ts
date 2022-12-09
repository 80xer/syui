import clsx from 'clsx';
import Component, { Params } from '../core/component';
import { hasClassInParents } from '../util';
import './select.style.scss';

export type SelectOption = {
  label: string;
  value: string;
};

export type Options = {
  placeholder?: string;
  selectOptions: SelectOption[];
};

export type SelectParams = Params;

export const CLASSNAMES = {
  selectContainer: 'syui-select-container',
  select: 'syui-select',
  selectFocused: 'syui-select__focused',
  selectValue: 'syui-select__value',
  selectOptions: 'syui-select__options',
  selectOptionList: 'syui-select__option-list',
  selectOption: 'syui-select__option',
  valueContainer: 'syui-select__value-container',
  selectedValue: 'syui-select__option-selected',
  hiddenInput: 'syui-select__input'
};

class Select extends Component {
  private containerMouseDownHandler(event: Event) {
    const target = event.target as HTMLElement;
    const chooseOption = hasClassInParents(target, CLASSNAMES.selectOptions);

    if (chooseOption) {
      this.state = {
        ...this.state,
        open: false,
        selected: { value: target.dataset.value, label: target.textContent }
      };
    } else {
      this.state.open = !this.state.open;
      (this.container.querySelector(`.${CLASSNAMES.hiddenInput}`) as HTMLElement)?.focus();
    }

    // keep input focused
    event.preventDefault();
  }

  private inpujtFocusInHandler() {
    if (!this.state.focused) this.state.focused = true;
  }

  private inputFocusoutHandler() {
    if (this.state.open) this.state.open = false;
    if (this.state.focused) this.state.focused = false;
  }

  private createOptionsTemplate() {
    const { selected, selectOptions } = this.state;
    const optionsString = selectOptions
      .map(
        (option: SelectOption) =>
          `<div class="${clsx(
            CLASSNAMES.selectOption,
            selected?.value === option.value ? CLASSNAMES.selectedValue : ''
          )}" data-value="${option.value}">${option.label}</div>`
      )
      .join('');
    const optionsTemplate = `
    <div class="${clsx(CLASSNAMES.selectOptions)}">
      <div class="${clsx(CLASSNAMES.selectOptionList)}">${optionsString}</div>
    </div>
    `;
    return optionsTemplate;
  }
  init() {
    const basicOptions = {
      placeholder: 'select...'
    };
    const options = Object.assign({}, basicOptions, this.props);
    this.state = {
      focused: false,
      selected: null,
      open: false,
      ...options
    };
  }
  setEvent() {
    this.addEvent('mousedown', `.${CLASSNAMES.selectContainer}`, (e) =>
      this.containerMouseDownHandler(e)
    );
    this.addEvent('focusin', `.${CLASSNAMES.hiddenInput}`, () => this.inpujtFocusInHandler());
    this.addEvent('focusout', `.${CLASSNAMES.hiddenInput}`, () => this.inputFocusoutHandler());
  }
  template() {
    const { selected, open, placeholder, focused } = this.state;

    return `
    <div role="select" class="${clsx('syui', CLASSNAMES.selectContainer)}">
      <div class="${clsx(CLASSNAMES.select, focused ? CLASSNAMES.selectFocused : '')}">
        <div class="${clsx(CLASSNAMES.valueContainer)}">
          <div role="button" class="${clsx(CLASSNAMES.selectValue)}">${
      selected?.label || placeholder
    }</div>
          <input tabindex="0" class="${CLASSNAMES.hiddenInput}" />
        </div>
      </div>
      ${open ? this.createOptionsTemplate() : ''}
    </div>
    `;
  }
}

export default Select;
