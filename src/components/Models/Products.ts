import { IProduct } from "../../types";

export class Products {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | null {
    return this.items.find((item) => item.id === id) || null;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
