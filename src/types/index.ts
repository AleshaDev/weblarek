export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}
export type TPayment = "card" | "cash" | "online";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type ValidationResult = {
  [key in keyof IBuyer]?: string;
};

export interface ProductsResponse {
  items: IProduct[];
}

export interface OrderRequest extends IBuyer {
  total: number;
  items: string[];
}
