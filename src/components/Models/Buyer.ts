import { IBuyer, TPayment, ValidationResult } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment | null = null;
  protected email: string | null = null;
  protected phone: string | null = null;
  protected address: string | null = null;

  constructor(protected events: IEvents) {}

  updateData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.events.emit("buyer:change", this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      email: this.email || "",
      phone: this.phone || "",
      address: this.address || "",
    };
  }

  clearData(): void {
    this.payment = null;
    this.email = null;
    this.phone = null;
    this.address = null;
    this.events.emit("buyer:change", this.getData());
  }

  validate(): ValidationResult {
    const errors: ValidationResult = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.email) {
      errors.email = "Укажите email";
    }
    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this.address) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }
}
