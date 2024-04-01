import {Model} from "./base/Model";
import {
        FormErrors, 
        IAppState, 
        IDeliveryForm, 
        ICard, 
        IContactsForm, 
        IOrderForm
} from "../types";

export type CatalogChangeEvent = {
    catalog: ICard[]
};

export class AppState extends Model<IAppState> {
    basket: ICard[] = [];
    catalog: ICard[];
    order: IOrderForm = {
        email: '',
        phone: '',
        items: [],
        payment: 'online',
        address: '',
        total: 0,
    };
    preview: string | null;
    formErrors: FormErrors = {};

    setDelivery(field: keyof IDeliveryForm, value: string) {
        this.order[field] = value;
        if (this.validateDelivery()) {
            this.events.emit('delivery:ready', this.order)
        }
    }

    clearBasket() {
        this.basket = [];
        this.emitChanges('count:changed', this.basket);
        this.emitChanges('basket:changed', this.basket);
    }

    addToBasket(item: ICard) {
        if (item.price !== null && this.basket.indexOf(item) === -1) {
            this.basket.push(item);
            this.emitChanges('count:changed', this.basket);
            this.emitChanges('basket:changed', this.basket);
        }
    }

    removeFromBasket(item: ICard) {
        const index = this.basket.indexOf(item);
        if (index !== -1) {
            this.basket.splice(index, 1);
        }
    }

    setContacts(field: keyof IContactsForm, value: string) {
        this.order[field] = value;
        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.order);
        }
    }

    setCatalog(items: ICard[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    validateDelivery() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}