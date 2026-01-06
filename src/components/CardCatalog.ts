import { Card, ICardActions } from "./common/Card";
import { ensureElement } from "../utils/utils";
import { categoryMap } from "../utils/constants";

export class CardCatalog extends Card<ICardActions> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super("card", container, actions); // Передаем имя блока 'card' для поиска элементов
    this._category = ensureElement<HTMLElement>(".card__category", container);
    this._image = ensureElement<HTMLImageElement>(".card__image", container);
  }

  set category(value: string) {
    this.setText(this._category, value);
    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    this._category.className = `card__category ${categoryClass}`;
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }
}
