import { Card, ICardActions } from "../components/common/Card";
import { ensureElement } from "../utils/utils";

export class CardBasket extends Card<ICardActions> {
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super("card", container, actions); // Используем класс 'card' и для корзины (согласно БЭМ веб-ларька)
    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }
}
