import {Component} from "./base/Component";
import {IProductCard} from "../types";
import {ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProductCard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLButtonElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    constructor( 
        container: HTMLElement, 
        actions?: ICardActions
        ) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = container.querySelector(`.card__image`);
        this._button = container.querySelector(`.card__button`);
        this._description = container.querySelector(`.card__description`);
        this._index = container.querySelector(`.basket__item-index`);
        this._category = container.querySelector(`.card__category`);
        this._price = container.querySelector(`.card__price`)

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set category(value: string) {
	    this.setText(this._category, value);
	}

    set index(value: string) {
	    this._index.textContent = value;
	}

    set price(value: string) {
	    if (value) {
            this.setText(this._price, `${value} синапсов`)
        } else {
            this.setText(this._price, `Бесценно`)
            this.setDisabled(this._button, true);
        }
	}

    get price(): string {
	    return this._price.textContent || '';
	}

    set buttonText(value: string) {
	    this.setText(this._button, value);
	}
}