import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, IProductCard} from "../types";

export interface ILarekAPI {
    getCardsList: () => Promise<IProductCard[]>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardsList(): Promise<IProductCard[]> {
        return this.get(`/product`).then((data: ApiListResponse<IProductCard>) => 
        data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}