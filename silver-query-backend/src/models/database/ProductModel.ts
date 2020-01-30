import { prop, Typegoose, ModelType, InstanceType, Ref } from '@hasezoey/typegoose';
import * as mongoose from 'mongoose';

export class Product extends Typegoose
{
    _id!: mongoose.Types.ObjectId;

    @prop({required:true})
    title!: string;

    @prop({ required: true })
    categoryId!: string;

    @prop({ required: true })
    productNumber!: number;

    @prop({ required: true })
    priceHuf!: number;

    @prop({ required: true })
    description!: string;

    @prop({ required: true })
    stockState!: "in-stock" | "order-only" | "other";

    @prop({ required: true })
    silverUrl!: string
}

export const ProductModel = new Product().getModelForClass(Product, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'products' }
})