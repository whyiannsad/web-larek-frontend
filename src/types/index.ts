export interface IProductItem {
    id: string;
    title: string;
    description?: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    contact: IContactsForm | null;
    delivery: IDeliveryForm | null;
    order: IOrderForm | null;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IDeliveryForm {
    address: string;
    payment: string;
}

export interface IOrderForm extends IContactsForm, IDeliveryForm {
    total: number;
    items: string[];
}

export interface IOrder extends IOrderForm {
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

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IActions {
    onClick: (event: MouseEvent) => void;
}