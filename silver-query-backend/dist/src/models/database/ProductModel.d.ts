import { Typegoose, InstanceType } from '@hasezoey/typegoose';
import * as mongoose from 'mongoose';
export declare class Product extends Typegoose {
    _id: mongoose.Types.ObjectId;
    title: string;
    categoryId: string;
    productNumber: number;
    priceHuf: number;
    description: string;
    stockState: "in-stock" | "order-only" | "other";
    silverUrl: string;
}
export declare const ProductModel: mongoose.Model<InstanceType<Product>, {}> & Product & typeof Product;
