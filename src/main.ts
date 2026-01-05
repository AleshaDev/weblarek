import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";
import { ApiService } from "./services/api/ApiService";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

// Создаём экземпляры моделей
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// Тестируем Products
console.log("--- Тестирование Products ---");
productsModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getItems());

const product = productsModel.getProductById("1");
console.log("Товар по ID=1:", product);

productsModel.setSelectedProduct(product!);
console.log("Выбранный товар:", productsModel.getSelectedProduct());

// Тестируем Cart
console.log("\n--- Тестирование Cart ---");
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log("Товары в корзине:", cartModel.getItems());
console.log("Общая стоимость:", cartModel.getTotalPrice());
console.log("Количество товаров:", cartModel.getItemCount());
console.log("Есть товар с ID=1 в корзине?", cartModel.hasItem("1"));

cartModel.removeItem(apiProducts.items[0]);
console.log("После удаления первого товара:", cartModel.getItems());

cartModel.clear();
console.log("Корзина после очистки:", cartModel.getItems());

// Тестируем Buyer
console.log("\n--- Тестирование Buyer ---");
buyerModel.updateData({
  payment: "card",
  email: "user@example.com",
});
console.log("Данные покупателя:", buyerModel.getData());

const validationErrors = buyerModel.validate();
console.log("Ошибки валидации:", validationErrors);

buyerModel.clearData();
console.log("Данные после очистки:", buyerModel.getData());

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);

// Создаём экземпляр Api с использованием константы API_URL
const apiClient = new Api(API_URL, {
  headers: {
    
  }
});

// Передаём его в ApiService
const apiService = new ApiService(apiClient);

(async () => {
  try {
    console.log("\n--- Получение товаров с сервера ---");
    const products = await apiService.getProducts();
    console.log("Полученные товары с сервера:", products);

    // Сохраняем в модель данных
    productsModel.setItems(products);
    console.log("Каталог после сохранения:", productsModel.getItems());
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
  }

  // 4. Пример отправки заказа
  try {
    console.log("\n--- Отправка заказа на сервер ---");

    console.log("buyerModel:", buyerModel.getData());
    console.log("cartModel:", cartModel.getItems());

    const orderData = {
      ...buyerModel.getData(), // Разворачиваем поля (payment, email...) в корень
      items: cartModel.getItems().map((item) => item.id), // заполняем айди товаров
      total: cartModel.getTotalPrice(), // передаём стоимость заказа
    };

    const response = await apiService.postOrder(orderData);
    console.log("Ответ сервера после отправки заказа:", response);
  } catch (error) {
    console.error("Ошибка при отправке заказа:", error);
  }
})();
