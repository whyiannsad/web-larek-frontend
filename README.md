# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# MVP

Архитектура проекта основывается на паттерне `MVP`. Этот паттерн разделяет приложение на три части: `model`, `view` и `presenter`. Модель содержит данные, представление отображает данные, а презентер обрабатывает взаимодействие между моделью и представлением.

- `Model` - работает с данными, проводит вычисления и руководит всеми бизнес-процессами. получение, обновление и удаление данных.
- `View` -  показывает пользователю интерфейс и данные из модели. Отображение данных, обработка нажатий кнопок, заполнения/отправка форма, а также их валидация. 
- `Presenter` - служит прослойкой между моделью и видом. Обработчик событий.

# Базовые классы

### 1. Класс EventEmitter

Базовый класс, суть которого заключается в том, чтобы позволить подписываться на события и уведомлять подписчиков о наступлении события.

Методы:
`on` - устанавливает обработчик на событие
`off` - сбрасывает обработчик с события
`emit` - уведомление подписчика о наступлении события
`onAll` - устанавливает обработчик на все события
`offAll` - сбрасывает обработчик на всех событиях
`trigger` - сделать коллбек триггер, генерирующий событие при вызове

### 2. Класс Api

Базовый класс для работы с API, который работает с базовыми HTTP-методами обращения к серверу GET/POST/PUT/DELETE.

Методы класса:
`handleResponse` - возвращает Json-ответ или сообщение об ошибке
`get` - выполняет GET-запросы к адресу
`post` - выполняет запрос с использованием предоставленого адреса

### 3. Класс Model

Базовый класс, предназначенный для создания моделей данных.

Методы класса:
`emitChanges` - сообщает всем, что модель поменялась

### 4. Класс Component

Базовый класс отрисовки пользовательского интерфейса, а также обеспечивающий инструментарий для работы с DOM-элементами в дочерних компонентах.

Методы класса:
`toggleClass` - переключает класс компонента
`setText` - устанавливает текстовое содержимое для компонента
`setDisabled` - меняет статус блокировки компонента
`setHidden` - скрывает компонент
`setVisible` - делает компонент видимым
`setImage` - устанавливает для компонента изображение с альтернативным текстом
`render` - возвращает корневой DOM-элемент

# Общие Компоненты

### 1. Класс AppState

Класс хранения состояния приложения. Наследуется от Model.

Методы класса:
`addToBasket` - добавление товара в корзину
`removeFromBasket` - удаление товара из корзины
`clearBasket` - очистка корзины
`setDelivery` - данные по доставке
`setContacts` - данные о контактах
`setCatalog` - каталог товаров
`setPreview` - предпросмотр продукта
`validateDelivery` - проверка валидности формы доставки
`validateContacts` - проверка валидности формы контактов

### 2. Класс LarekAPI 

Наследуется от класса Api. Взаимодействует с сервером.

Методы класса:
`getCardsList` - получает список продуктов и их данные;
`getProductItem` - получает данные продукта;
`orderProducts` - отправляет заказ и получает ответ;

# Компоненты представления

### 1. Класс ContactsForm

Класс управляет и отображает форму ввода контактов для составления заказа. Наследуется от Form.

Методы класса:
`phone` - устанавливает номер телефона;
`email` - устанавливает email;

### 2. Класс DeliveryForm

Класс упарвляет и отображает форму ввода и выбора данных для доставки. Наследуется от Form.

Методы класса:
`toggleButtons` - управляет состоянием кнопки оплаты;
`set address` - устанавливает адрес доставки;

### 3. Класс Page

Класс отображения страницы с товарами и корзиной. Наследуется от Component.

Методы класса:
`counter` - значение счетчика товаров в корзине;
`catalog` - каталог продуктов;
`locked` - блокировка прокрутки страницы в модальном окне;

### 4. Класс Card

Класс карточки товара и отображения ее данных. Наследуется от Component.

Методы класса:
`set/get id` - управляет идентификатором карточки
`set/get title` - управляет названием товара
`set image` - устанавливает изображение товара
`set description` - устанавливает описание товара


### 5. Класс Basket

Класс отображения корзины и входящих в нее товаров. Наследуется от Component.

Методы класса:
`set items` - устанавливает товары в корзине
`set/get total` - устанавливает и отображает общую стоимость товаров в корзине


### 6. Класс Modal

Класс отображения модального окна. Наследуется от Component.

Компонент наследования:
`set content` - устанавливает содержимое модального окна
`open` - открывает модального окно и вызывает событие открытия
`close` - закрывает модальное окно и вызывает событие закрытия окна
`render` - рендерит модальное окно и открывает его

### 7. Класс Success

Класс отображения модального окна успешного оформления товара. Наследуется от Component.

Методы класса:
`total` - устанавливает значение общей суммы заказа

### 8. Класс Form

Класс обрабатывает результаты ввода форм и передает информацию об результах валдиации и сообщение об ошибке.

## Интерфейсы
```
export interface IProductItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    category: string;
    price: number | null;
}

export interface ILarekAPI {
    getCardsList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    contact: IContactsForm | null;
    delivery: IDeliveryForm | null;
    order: IOrder | null;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IDeliveryForm {
    address: string;
    payment: string;
}

export interface IModalData {
    content: HTMLElement;
}

export interface IOrder extends IContactsForm, IDeliveryForm {
	total: number;
	items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IProduct extends IProductItem {
    counter?: string;
    buttonText?: string;
    index?: string;
}

export interface ISuccess {
    total: number | null;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IActions {
    onClick: (event: MouseEvent) => void;
}
```