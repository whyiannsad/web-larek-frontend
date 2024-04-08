import {Form} from "./common/Form";
import {IDeliveryForm, IActions, IContactsForm} from "../types";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IContactsForm> {
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

export class Delivery extends Form<IDeliveryForm> {
	protected _buttonOnline: HTMLButtonElement;
	protected _buttonOffline: HTMLButtonElement;

	constructor(
		container: HTMLFormElement, events: IEvents, actions?: IActions) {
		super(container, events);

		this._buttonOnline = ensureElement<HTMLButtonElement>('button[name="card"]', container);
		this._buttonOffline = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
		this._buttonOnline.classList.add('button_alt-active');

		if (actions?.onClick) {
			this._buttonOnline.addEventListener('click', actions.onClick);
			this._buttonOffline.addEventListener('click', actions.onClick);
		}
	}

	paymentButtons(toggleButton: HTMLButtonElement) {
		this._buttonOnline.classList.remove('button_alt-active');
		this._buttonOffline.classList.remove('button_alt-active');
		toggleButton.classList.add('button_alt-active');
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}