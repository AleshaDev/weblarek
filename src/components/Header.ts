import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { ensureElement } from "../utils/utils";

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  protected _basket: HTMLButtonElement;
  protected _counter: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._basket = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container
    );
    this._counter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container
    );

    this._basket.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }
}
