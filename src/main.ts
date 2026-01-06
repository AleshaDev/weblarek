import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { ApiService } from "./services/api/ApiService";
import { EventEmitter } from "./components/base/Events";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

import { Modal } from "./components/common/Modal";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";

import { CardCatalog } from "./components/CardCatalog";
import { CardPreview } from "./components/CardPreview";
import { CardBasket } from "./components/CardBasket";

import { IProduct, IOrderForm } from "./types";
import { Basket } from "./components/Basket";
import { Order } from "./components/Order";
import { Contacts } from "./components/Contacts";
import { Success } from "./components/common/Success";

// --- 1. Инициализация слоев ---
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new ApiService(baseApi);

// --- 2. Шаблоны ---
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// --- 3. Модели данных ---
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// --- 4. Глобальные контейнеры UI ---

const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

// Инициализируем переиспользуемые компоненты
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// --- БИЗНЕС-ЛОГИКА ---

// > Обработка события: изменение каталога товаров
events.on("items:change", () => {
  const cards = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
    });
  });

  gallery.render({
    catalog: cards,
  });
});

// > Обработка события: выбор карточки для просмотра
events.on("card:select", (item: IProduct) => {
  productsModel.setSelectedProduct(item);
});

// > Обработка события: изменение выбранного товара (открытие превью)
events.on("preview:change", (item: IProduct) => {
  if (!item) {
    modal.close();
    return;
  }

  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit("card:addToBasket", item),
  });

  const buttonText = cartModel.hasItem(item.id)
    ? "Удалить из корзины"
    : "В корзину";

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      description: item.description,
      price: item.price,
      category: item.category,
      buttonTitle: buttonText,
    }),
  });
});

// > Обработка события: клик по кнопке "В корзину/Удалить" в карточке
// Услышали, что "кричит" эмит card:addToBasket. Забрали из него item
events.on("card:addToBasket", (item: IProduct) => {
  if (cartModel.hasItem(item.id)) {
    cartModel.removeItem(item);
  } else {
    cartModel.addItem(item);
  }

  // Обратно вызвали 'preview:change', который "кричал"
  events.emit("preview:change", item);
});

// > Обработка события: изменение содержимого корзины (счетчик)
events.on("cart:change", () => {
  header.counter = cartModel.getItemCount();
});

// > Обработка события: открытие корзины
events.on("basket:open", () => {
  const items = cartModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit("basket:delete", item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  modal.render({
    content: basket.render({
      items,
      total: cartModel.getTotalPrice(),
    }),
  });
});

// > Обработка удаления из корзины
events.on("basket:delete", (item: IProduct) => {
  cartModel.removeItem(item);

  const items = cartModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit("basket:delete", item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basket.render({
    items,
    total: cartModel.getTotalPrice(),
  });
});

// > Обработка события: открытие формы заказа
events.on("order:open", () => {
  const formData = buyerModel.getData();
  const errors = buyerModel.validate();

  modal.render({
    content: order.render({
      address: formData.address,
      payment: formData.payment,
      valid: !errors.address && !errors.payment,
      errors: [],
    }),
  });
});

// > Обработка события: переход ко второй форме (Контакты)
events.on("order:submit", () => {
  const formData = buyerModel.getData();
  const errors = buyerModel.validate();

  modal.render({
    content: contacts.render({
      email: formData.email,
      phone: formData.phone,
      valid: !errors.email && !errors.phone,
      errors: [],
    }),
  });
});

// > Обработка событий ввода данных в инпуты
events.on(
  "order.payment:change",
  (data: { field: keyof IOrderForm; value: string }) => {
    buyerModel.updateData({ payment: data.value as any });
    // Пометка для себя, чтобы опять все по новой не забыть!!!!
    // Присваиваем в order.payment, а не вызываем метод как order.payment(data.value) потому что это сеттер, он так работает, это просто такой синтаксис
    order.payment = data.value;
  }
);

events.on(
  "order.address:change",
  (data: { field: keyof IOrderForm; value: string }) => {
    buyerModel.updateData({ address: data.value });
  }
);

events.on(
  "contacts.email:change",
  (data: { field: keyof IOrderForm; value: string }) => {
    buyerModel.updateData({ email: data.value });
  }
);

events.on(
  "contacts.phone:change",
  (data: { field: keyof IOrderForm; value: string }) => {
    buyerModel.updateData({ phone: data.value });
  }
);

// > Обработка события: изменение данных покупателя (ВАЛИДАЦИЯ)
events.on("buyer:change", () => {
  const validationErrors = buyerModel.validate();
  const orderDom = (order as any).container;
  const contactsDom = (contacts as any).container;

  // --- ШАГ 1: АДРЕС + ОПЛАТА ---
  if (orderDom.parentNode) {
    const isValid = !validationErrors.address && !validationErrors.payment;

    order.valid = isValid;
    order.errors = [validationErrors.payment, validationErrors.address]
      .filter(Boolean)
      .join("; ");
  }

  // --- ШАГ 2: КОНТАКТЫ ---
  if (contactsDom.parentNode) {
    const isValid = !validationErrors.email && !validationErrors.phone;
    contacts.valid = isValid;
    contacts.errors = [validationErrors.email, validationErrors.phone]
      .filter(Boolean)
      .join("; ");
  }
});

// > Обработка события: финальная отправка заказа
events.on("contacts:submit", () => {
  const items = cartModel.getItems();
  const orderData = {
    ...buyerModel.getData(),
    total: cartModel.getTotalPrice(),
    items: items.map((item) => item.id),
  };

  api
    .postOrder(orderData)
    .then((result) => {
      cartModel.clear();
      buyerModel.clearData();

      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => modal.close(),
      });

      modal.render({
        content: success.render({
          total: result.total,
        }),
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

// Загрузка товаров
api
  .getProducts()
  .then((items) => {
    const itemsWithImage = items.map((item) => ({
      ...item,
      image: CDN_URL + item.image,
    }));
    productsModel.setItems(itemsWithImage);
  })
  .catch((err) => {
    console.error(err);
  });
