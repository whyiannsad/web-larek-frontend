import './scss/styles.scss';

import {LarekAPI} from "./components/LarekAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent} from "./components/AppData";
import {Page} from "./components/Page";
import {Card} from "./components/Card";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IDeliveryForm, IContactsForm, IProductCard} from "./types";
import {Order, Delivery} from "./components/Order";
import {Success} from "./components/common/Success";

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
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(contactsTemplate), events);
const deliver = new Delivery(cloneTemplate(orderTemplate), events, {
    onClick: (event: Event) => { events.emit('payment:changed', event.target)}
});
const PaymentVariant: Record<string, string> = {card: 'online', cash: 'offline'};

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Выводим карточки
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
});

// Оплачиваем заказ
events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                }
            });
            modal.render({
                content: success.render({})
            });
            success.total = result.total;
            appData.clearBasket()
        })
        .catch(err => {
            console.error(err);
        });
});

// Изменилось одно из полей
events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm, value: string }) => {
    appData.setContactsForm(data.field, data.value);
});

// Показ ошибок валидации телефона и почты
events.on('formErrors:change', (errors: Partial<IContactsForm>) => {
	const {email, phone} = errors;
	order.valid = !email && !phone;
	order.errors = Object.values({phone, email}).filter((i) => !!i).join('; ');
})

// Изменения доставки
events.on(/^order\..*:change/, (data: { field: keyof IDeliveryForm, value: string }) => {
    appData.setDeliveryForm(data.field, data.value);
});

// Показ ошибок валидации оплаты и адреса
events.on('formErrors:change', (errors: Partial<IDeliveryForm>) => {
	const {payment, address,} = errors;
	deliver.valid = !payment && !address;
	deliver.errors = Object.values({payment, address}).filter((i) => !!i).join('; ');
})


// Открыть форму с почтой
events.on('order:submit', () => {
    appData.order.items = appData.basket.map((item) => item.id);
    modal.render({
        content: order.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

// Открыть окно с оплатой и адресом
events.on('order:open', () => {
    modal.render({
        content: deliver.render({
            payment: '',
            address: '',
            valid: false,
            errors: [],
          })
    });
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: basket.render({})
    });
});

// Изменения в корзине
events.on('basket:changed', () => {
    basket.items = appData.basket.map((item, index) => {
        const product = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('product:delete', item)
        });
        return product.render({
            title: item.title,
            price: item.price,
            count: index + 1,
        });
    });
    basket.total = appData.getTotalResult();
	appData.order.total = appData.getTotalResult();
})

// Открыть товар
events.on('card:select', (item: IProductCard) => {
    appData.setPreview(item);
});

// Счетчик
events.on('counter:changed', () => {
	page.counter = appData.basket.length;
})

// Добавление или удаление товара из корзины 
events.on('preview:changed', (item: IProductCard) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
		    card.buttonText = appData.spotProductInBasket(item)? 'Добавить' : 'Удалить из корзины';
            if (!appData.spotProductInBasket(item)) {
                appData.addToBasket(item);
            } else {
                appData.removeFromBasket(item);
            };
		}
	});
    modal.render({
        content: card.render({
            category: item.category,
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            buttonText: appData.spotProductInBasket(item)? 'Удалить из корзины' : 'Добавить',
        }),
    });
});

// Смена способов оплаты
events.on('payment:changed', (target: HTMLButtonElement) => {
	if (!target.classList.contains('button_alt-active')) {
		deliver.paymentButtons(target);
		appData.order.payment = PaymentVariant[target.getAttribute('name')];
	}
});

// Добавить
events.on('product:add', (item: IProductCard) => {
	appData.addToBasket(item);
});

// Удалить
events.on('product:delete', (item: IProductCard) => {
	appData.removeFromBasket(item);
});

// Блокируем прокрутку страницы
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем карточки с сервера
api.getCardsList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });