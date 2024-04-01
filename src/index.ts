import './scss/styles.scss';

import {LarekAPI} from "./components/LarekAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent} from "./components/AppData";
import {Page} from "./components/Page";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IDeliveryForm, IContactsForm, ICard} from "./types";
import {DeliveryForm, ContactsForm, PaymentMethod} from "./components/Order";
import {Success} from "./components/common/Success";
import {Card} from './components/Card';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(deliveryTemplate), events, {
    onClick: (event: Event) => { events.emit('payment:changed', event.target)}
});
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });

});



// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render({})
    })
})

// Открытие карточки
events.on('card:select', (item: ICard) => {
    appData.setPreview(item);
})

events.on('preview:changed', (item: ICard) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        events.emit('item:check', item);
        card.buttonText = appData.basket.indexOf(item) === -1 ? 'В корзину' : 'Убрать из корзины';
      }
    })
  
    modal.render({
      content: card.render({
        category: item.category,
        title: item.title,
        image: item.image,
        description: item.description,
        price: item.price,
        buttonText: appData.basket.indexOf(item) === -1 ? 'В корзину' : 'Убрать из корзины',
      })
    })
});


// Добавить в корзину
events.on('item:add', (item: ICard) => {
    appData.addToBasket(item);
})

// Удаление из корзины
events.on('item:remove', (item: ICard) => {
    appData.removeFromBasket(item);
})

// Проверка товара в корзине
events.on('item:check', (item: ICard) => {
    (appData.basket.indexOf(item) === -1) ?
    events.emit('item:add', item) : events.emit('item:remove', item);
})

// Обновление корзины
events.on('basket:changed', (items: ICard[]) => {
    basket.items = items.map((item, count) => {
      const card = new Card(cloneTemplate(cardBasketTemplate), {
        onClick: () => {events.emit('item:remove', item)}
      });
      return card.render({
        title: item.title,
        price: item.price,
        count: (count++).toString(),
      });
    });
    let total = 0;
    items.forEach(item => {
      total = total + item.price;
    });
    basket.total = total;
    appData.order.total = total;
});

// Счетчик товаров в корзине
events.on('count:changed', () => {
    page.counter = appData.basket.length;
})


// Форма доставки
events.on('order:open', () => {
    modal.render({
      content: delivery.render({
        payment: '',
        address: '',
        valid: false,
        errors: [],
      })
    });
});

// Способ оплаты
events.on('payment:changed', (target: HTMLElement) => {
    if(!target.classList.contains('button_alt-active')) {
      delivery.changePayment();
      appData.order.payment = PaymentMethod[target.getAttribute('name')];
    };
});

// Изменения доставки
events.on(/^order\..*:change/, (data: { field: keyof IDeliveryForm, value: string }) => {
    appData.setDelivery(data.field, data.value);
});


//Валидация формы ввода адреса
events.on('deliveryForm:changed', (errors: Partial<IDeliveryForm>) => {
    const { payment, address } = errors;
    delivery.valid = !payment && !address;
    delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  });
  

// Валидация доставки
events.on('delivery:ready' , () => {
    delivery.valid = true;
});

// Форма контактов
events.on('order:submit', () => {
    modal.render({
      content: contacts.render({
        email: '',
        phone: '',
        valid: false,
        errors: [],
      })
    });
    appData.order.items = appData.basket.map((item) => item.id);
});

//Изменения в полях ввода контактов
events.on(/^contacts\..*:change/, (data: {field: keyof IContactsForm, value: string}) => {
    appData.setContacts(data.field, data.value)
})
  
//Валидация формы ввода контактов
events.on('contacts:changed', (errors: Partial<IContactsForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});
  
//Валидация формы контактов выполнена
events.on('contacts:ready' , () => {
    contacts.valid = true;
});

// Оформление заказа
events.on('contacts:submit', () => {
    api.orderItems(appData.order)
      .then((result) => {
        
        const success = new Success(cloneTemplate(successTemplate), {
            onClick: () => {
                modal.close();
                appData.clearBasket();
                console.log ('Работает')
            }
        });
        success.total = result.total.toString();
  
        modal.render({
            content: success.render({})
        });
      })
      .catch(err => {
          console.error(err);
          console.log('не работает')
      });
  })



// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем после закрытия модалки
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
});