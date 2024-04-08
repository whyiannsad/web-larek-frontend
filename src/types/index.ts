export interface IProductItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    category: string;
    price: number | null;
}

export interface ILarekAPI {
    getCardsList: () => Promise<IProductItem[]>;
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

export interface IProductCard extends IProductItem {
    count?: number;
    buttonText?: string;
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