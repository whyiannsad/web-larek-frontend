import {Component} from "./base/Component";
import {ICard, IActions} from "../types";

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _count?: HTMLElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);

        this._title = container.querySelector('.card__title');
        this._image = container.querySelector('.card__image');
        this._button = container.querySelector('.card__button');
        this._description = container.querySelector('.card__text');
        this._category = container.querySelector('.card__category');
        this._price = container.querySelector('.card__price');
        this._count = container.querySelector('.basket__item-index');

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

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set button(value: string) {
        this.setText(this._button, value);
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set price(value: number | null) {
        value === null ? this.setText(this._price, 'Бесценно') : this.setText(this._price, `${value.toString()} синапсов`);
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    get price(): number {
        return Number(this._price.textContent || '');
    }
}