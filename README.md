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

## Класс EventEmitter
Базовый класс, суть которого заключается в том, чтобы дать возможность с любого места в нашем приложении сообщить о каком-либо событии. Все, кто были «подписаны» на это событие сразу же об этом узнают и как-то отреагируют. Является классом Наблюдателем.

Методы класса:
- `on` - устанавливает обработчик на событие
- `off` - сбрасывает обработчик с события
- `emit` - инициирует событие с данными
- `onAll` - устанавливает обработчик на **все** события
- `offAll` - сбрасывает обработчик на **всех** событиях
- `trigger` - устанавливает коллбэк-триггер, генерирующий заданное событие при вызове

## Класс Api
Базовый класс для работы с API, который работает с базовыми HTTP-методами обращения к серверу **GET/POST/PUT/DELETE**.

Методы класса:
- `handleResponse` - обрабатывает ответы сервера, преобразуя их в данные формата json или выдавая ошибки
- `get` - выполняет **GET-запросы** на сервер
- `post` - выполняет запрос с использованием предоставленого метода **POST/PUT/DELETE**

## Класс Model<T>
Базовый класс, предназначенный для создания моделей данных, предназначенных для управления данными приложения.

Методы:
- `emitChanges` - сообщает всем подписчикам, что модель поменялась

## Класс Component<T>
Базовый класс отрисовки пользовательского интерфейса, а также обеспечивающий инструментарий для работы с DOM-элементами в дочерних компонентах.

Методы:
- `toggleClass` - переключает класс компонента
- `setText` - устанавливает текстовое содержимое для компонента
- `setDisabled` - меняет статус блокировки компонента
- `setHidden` - скрывает компонент
- `setVisible` - делает компонент видимым
- `setImage` - устанавливает для компонента изображение с альтернативным текстом
- `render` - возвращает корневой DOM-элемент

# Компоненты данных

## Класс ProductItem
Класс создания у управления данными продукта.

Компонент наследования:
```typescript
interface IProductItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    category: string;
    price: number | null;
}
```

## Класс AppState
Класс хранения состояния приложения (данных входящих в него компонентов).

Методы:
- `addToBasket` - добавление товара в корзину
- `removeFromBasket` - удаление товара из корзины
- `clearBasket` - очистка корзины
- `setDelivery` - данные по доставке
- `setContacts` - данные о контактах
- `setCatalog` - каталог товаров
- `setPreview` - предпросмотр продукта
- `validateDelivery` - проверка валидности формы доставки
- `validateContacts` - проверка валидности формы контактов


Компонент наследования:
```typescript
interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    contact: IContactsForm | null;
    delivery: IDeliveryForm | null;
    order: IOrderForm | null;
}
```

# Компоненты представления

## Класс ContactsForm
Класс управляет и отображает форму ввода контактов для составления заказа. Наследуется от Component.

Компонент наследования:
```typescript
interface IContactsForm {
    email: string;
    phone: string;
}
```

## Класс DeliveryForm
Класс упарвляет и отображает форму ввода и выбора данных для доставки при составлении заказа. Наследуется от Component.

Компонент наследования:
```typescript
interface IDeliveryForm {
    address: string;
    payment: string;
}
```

## Класс Page
Класс отображения страницы с товарами и корзиной. Наследуется от Component.

Компонент наследования:
```typescript
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

## Класс Card
Класс карточки товара и отображения ее данных. Наследуется от Component.

Компонент наследования:
```typescript
interface ICard extends IProductItem {
    count?: string;
    buttonText?: string;
}
```


## Класс Basket
Класс отображения корзины и входящих в нее товаров. Наследуется от Component.

Компонент наследования:
```typescript
interface IBasketView {
    items: HTMLElement[];
    total: number;
}
```


## Класс Modal
Класс отображения модального окна. Наследуется от Component.

Компонент наследования:
```typescript
interface IModalData {
    content: HTMLElement;
}
```

## Класс Success
Класс отображения успешного оформления товара. Наследуется от Component.

Компонент наследования:
```typescript
interface ISuccess {
    total: number | null;
}
```



# Типы данных

```typescript
// Ответ сервера
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

// Event
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};

// Товар
export interface IProductItem {
    id: string;
    title: string;
    description?: string;
    image?: string;
    category: string;
    price: number | null;
}

// Приложение
export interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    contact: IContactsForm | null;
    delivery: IDeliveryForm | null;
    order: IOrderForm | null;
}

// Контакты
export interface IContactsForm {
    email: string;
    phone: string;
}

// Доставка
export interface IDeliveryForm {
    address: string;
    payment: string;
}

// Данные заказа
export interface IOrderForm extends IContactsForm, IDeliveryForm {
    total: number;
    items: string[];
}

// Ответ на заказ
export interface IOrderResult {
    id: string;
    total: number;
}

// Компоненты представления
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

// Карточка
export interface ICard extends IProductItem {
    count?: string;
    buttonText?: string;
}

// Отображение заказа
export interface ISuccess {
    total: number | null;
}

// Валидность формы
export interface IFormState {
    valid: boolean;
    errors: string[];
}

// Отображение корзины
export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

// Ошибки форм
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

// Модальное окно
export interface IModalData {
    content: HTMLElement;
}

// Методы для API приложения
export interface ILarekAPI {
    getCardList: () => Promise<ICard[]>;
    orderItems: (order: IOrderForm) => Promise<IOrderResult>;
}

export interface IActions {
    onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
    onClick: () => void;
}
```