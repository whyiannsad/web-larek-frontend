import {Form} from "./common/Form";
import {IContactsForm, IDeliveryForm, IActions} from "../types";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class ContactsForm extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}

export class DeliveryForm extends Form<IDeliveryForm> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, actions: IActions) {
        super(container, events)
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this._cardButton.classList.add('button_alt-active');
        
        if (actions.onClick) {
            this._cardButton.addEventListener('click', actions.onClick);
            this._cashButton.addEventListener('click', actions.onClick);
        }
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    changePayment() {
        this._cardButton.classList.toggle('button_alt-active');
        this._cashButton.classList.toggle('button_alt-active');
    }
}

export const PaymentMethod: { [key: string]: string } = {
    "card": "online",
    "cash": "cash",
}