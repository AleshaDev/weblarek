import { Api } from "../../components/base/Api";
import { IProduct, ProductsResponse, OrderRequest, IOrderResult} from "../../types";

export class ApiService {
  private api: Api;
  constructor(api: Api) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    const response = await this.api.get("/product/");
    const data: ProductsResponse = response as ProductsResponse;
    return data.items;
  }

  async postOrder(orderData: OrderRequest): Promise<IOrderResult> {
    return await this.api.post<IOrderResult>("/order/", orderData);
  }
}
