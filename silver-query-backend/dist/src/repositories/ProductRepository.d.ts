import { Product } from "../models/database/ProductModel";
export default class ProductRepository {
    constructor();
    getProductById(id: string): Promise<Product | null>;
    addProduct(ent: Product): Promise<boolean>;
    getAllProducts(): Promise<Product[]>;
    bulkAddProduct(cats: Product[]): Promise<boolean>;
}
