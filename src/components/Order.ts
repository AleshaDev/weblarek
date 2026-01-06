import { Form } from "./common/Form";
import { IOrderForm } from "../types";
import { IEvents } from "./base/Events";
import { ensureAllElements } from "../utils/utils";

export class Order extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    // Находим кнопки выбора оплаты
    this._buttons = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      container
    );

    // Вешаем обработчик клика на кнопки

    // Пометка для себя, чтобы опять все по новой не забыть!!!!
    // Пример, чтобы до конца понять как работает схема Клик (View) -> Эмит события -> Презентер -> Сеттер (View).
    // Order.ts: достал 'card' из кнопки -> передал в onInputChange.
    // Form.ts: положил 'card' в свойство value объекта -> отправил emit.
    // main.ts: поймал объект data, достал data.value (это 'card') -> присвоил в order.payment. (Также записали в модель, Buyer.ts, что выбрана card)
    // Order.ts: сеттер получил 'card' и покрасил кнопку.

    this._buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const paymentMethod = button.name; // card или cash

        this.onInputChange("payment", paymentMethod); // Эмитим событие
      });
    });
  }

  // Переключатель активного класса у кнопок
  set payment(value: string) {
    this._buttons.forEach((button) => {
      this.toggleClass(button, "button_alt-active", button.name === value);
    });
  }

  // Сеттер для адреса (чтобы при открытии формы адрес подставлялся, если уже введен)
  set address(value: string) {
    (this.container.elements.namedItem("address") as HTMLInputElement).value =
      value;
  }
}
