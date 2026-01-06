import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this._notify();
  }

  removeItem(item: IProduct): void {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this._notify();
    }
  }

  clear(): void {
    this.items = [];
    this._notify();
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
  private _notify() {
    this.events.emit("cart:change", {
      items: this.items,
      total: this.getTotalPrice(),
    });
  }
}
