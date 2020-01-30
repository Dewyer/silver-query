import { Product } from "./Product";
export interface ProductsCollection {
    byCategory: {
        [key: string]: Product[];
    };
}
