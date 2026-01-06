import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container
    );
    this._content = ensureElement<HTMLElement>(".modal__content", container);

    this._closeButton.addEventListener("click", this.close.bind(this));

    // mousedown, а не просто клик, чтобы не было такого, когда кликнул внутри модалки, а отпустил вне и все закрылось
    this.container.addEventListener("mousedown", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    this._content.addEventListener("mousedown", (evt) => {
      evt.stopPropagation();
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
