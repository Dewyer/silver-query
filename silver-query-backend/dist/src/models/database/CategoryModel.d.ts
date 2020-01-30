import { Typegoose, InstanceType } from '@hasezoey/typegoose';
import * as mongoose from 'mongoose';
export declare class Category extends Typegoose {
    _id: mongoose.Types.ObjectId;
    name: string;
    subCategoriesIds: string[];
    subCategories?: Category[];
    productsLink: string;
}
export declare const CategoryModel: mongoose.Model<InstanceType<Category>, {}> & Category & typeof Category;
