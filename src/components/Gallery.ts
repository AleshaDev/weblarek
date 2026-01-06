import { Component } from "./base/Component";

interface IGalleryState {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryState> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
