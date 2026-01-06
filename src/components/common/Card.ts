import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProduct {
  index?: number;
  buttonTitle?: string;
}

export class Card<T> extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _id: string = ""; // поле для хранения ID

  constructor(
    blockName: string,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._button = container.querySelector(
      `.${blockName}__button`
    ) as HTMLButtonElement;

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }

  set id(value: string) {
    this._id = value;
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    this.setText(this._price, value ? `${value} синапсов` : "Бесценно");
    if (this._button) {
      this.setDisabled(this._button, !value);
    }
  }

  set buttonTitle(value: string) {
    if (this._button) {
      this.setText(this._button, value);
    }
  }
}
