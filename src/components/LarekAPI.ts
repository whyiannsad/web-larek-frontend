import {Api} from './base/api';
import {IOrderForm, IOrderResult, ApiListResponse, ILarekAPI, ICard} from "../types";

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<ICard[]> {
        return this.get(`/product`).then((data: ApiListResponse<ICard>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image,
        }))
        );
    }

    orderItems(order: IOrderForm): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        )
    }
}