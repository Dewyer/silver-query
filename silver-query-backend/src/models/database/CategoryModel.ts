import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp } from '@hasezoey/typegoose';
import * as mongoose from 'mongoose';
import { ICategory } from '../Category';

export class Category extends Typegoose
{
    _id!: mongoose.Types.ObjectId;

    @prop({required:true})
    name!:string;

    @prop({ required: true })
    subCategoriesIds!:string[];

    subCategories?:Category[]

    @prop({ required: true })
    productsLink!:string;
}

export const CategoryModel = new Category().getModelForClass(Category, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'categories' }
})