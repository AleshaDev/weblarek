import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  protected items: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    //Cписок товаров обновился (нужно перерисать каталог)
    this.events.emit("items:change", { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | null {
    return this.items.find((item) => item.id === id) || null;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    //Выбран товар (открыть модальное окно)
    this.events.emit("preview:change", product);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
