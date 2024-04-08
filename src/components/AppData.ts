import {Model} from "./base/Model";
import {FormErrors, IAppState, IOrder, IProductItem, IDeliveryForm, IContactsForm, IProductCard,} from "../types";

export type CatalogChangeEvent = {
    catalog: IProductCard[]
};

export class AppState extends Model<IAppState> {
    basket: IProductCard[] = [];
    catalog: IProductCard[];
    order: IOrder = {
        payment: 'online',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0,
    };
    preview: string | null;
    formErrors: FormErrors = {};

    updateBasket() {
	    this.emitChanges('counter:changed', this.basket);
        this.emitChanges('basket:changed', this.basket);
	}

    setPreview(item: IProductCard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setCatalog(items: IProductCard[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    clearBasket() {
	    this.basket = [];
        this.updateBasket();
	}

    addToBasket(item: IProductCard) {
	    this.basket.push(item);
	    this.updateBasket();
    }

    removeFromBasket(item: IProductCard) {
	    this.basket = this.basket.filter((product) => product.id != item.id);
	    this.updateBasket();
	}

    spotProductInBasket (item: IProductCard) {
        return this.basket.includes(item);
    }

    setContactsForm(field: keyof IContactsForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('contacts:ready', this.order);
        }
    }

    validateOrder() {
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

    setDeliveryForm(field: keyof IDeliveryForm, value: string) {
        this.order[field] = value;

        if (this.validateAddress()) {
            this.events.emit('delivery:ready', this.order);
        }
    }

    validateAddress() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    getTotalResult(): number {
        return this.basket.reduce((result, item) => result + item.price, 0);
    }
}