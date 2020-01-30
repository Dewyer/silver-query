import { prop, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';
import { ICategory } from '../Category';

export class Category extends Typegoose
{
    _id!: mongoose.Types.ObjectId;

    @prop({required:true})
    name!:string;

    @prop({ required: true })
    subCategories!:string[];

    @prop({ required: true })
    productsLink!:string;
}

export const CategoryModel = new Category().getModelForClass(Category, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'categories' }
})