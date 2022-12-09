import { updateElement } from '../util';

export type Params = {
  container: HTMLElement;
  props: Record<string, any>;
};

type State = Record<string, any>;

class Component {
  container: HTMLElement;
  props: Record<string, any>;
  #state!: State;
  eventCallback: Record<string, any> = {};
  constructor(params: Params) {
    this.props = params.props;
    this.container = params.container;
    this.init();
    this.setEvent();
  }
  protected init() {
    throw new Error('Implement an init method to initialize the state');
  }
  protected template() {
    return ``;
  }
  get state() {
    return this.#state;
  }
  set state(newState: State) {
    this.#state = this.setState(newState);
    this.render();
  }
  private setState(state: State) {
    return new Proxy(state, {
      set: (target, prop: string, value) => {
        if (target[prop] === value) return false;
        target[prop] = value;
        this.render();
        return true;
      }
    });
  }
  protected addEvent(eventType: string, selector: string, callback: (event: Event) => void) {
    const children = [...this.container.querySelectorAll(selector)];
    const isTarget = (target: HTMLElement) => children.includes(target) || target.closest(selector);
    this.eventCallback[`${eventType}:${selector}`] = (event: Event) => {
      if (!isTarget(event.target as HTMLElement)) return false;
      callback && callback(event);
      return true;
    };
    this.container.addEventListener(eventType, this.eventCallback[`${eventType}:${selector}`]);
  }
  protected removeEvent(eventType: string, selector: string) {
    this.container.removeEventListener(eventType, this.eventCallback[`${eventType}:${selector}`]);
  }

  protected setEvent() {}
  protected render() {
    const oldNode = this.container.firstChild as HTMLElement;
    const newParent = document.createElement('div');
    newParent.innerHTML = this.template().trim();
    const newNode: HTMLElement = newParent.firstChild as HTMLElement;
    updateElement(this.container, newNode, oldNode);
    this.mounted();
  }
  protected mounted() {}
}

export default Component;
