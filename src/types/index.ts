export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

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
    image: string;
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
    getCard: (id: string) => Promise<ICard>;
    orderItems: (order: IOrderForm) => Promise<IOrderResult>;
}

export interface IActions {
    onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
    onClick: () => void;
}