import { Category, CategoryModel } from "../models/database/CategoryModel";
import { Model } from "mongoose";
import { injectable } from "tsyringe";

@injectable()
export default class CategoryRepository
{

    constructor()
    {
    }

    public async syncSubCategories(cat: Category)
    {
        if (cat.subCategories)
        {
            for (let ii = 0; ii < cat.subCategories.length; ii++)
            {
                if (!cat.subCategoriesIds.includes(cat._id.toHexString()))
                {
                    cat.subCategoriesIds.push(cat._id.toHexString());
                }
            }
            for (let ii = 0; ii < cat.subCategoriesIds.length; ii++)
            {
                if (!cat.subCategories.some(xx => xx._id.toHexString() === cat.subCategoriesIds[ii]))
                {
                    let kk = await this.getCategoryById(cat.subCategoriesIds[ii]);
                    if (kk)
                        cat.subCategories.push(kk);
                }
            }
        }
    }

    public async getCategoryById(id: string): Promise<Category | null>
    {
        let res = await CategoryModel.findById(id).exec();
        if (res)
        {
            await this.syncSubCategories(res);
            return res as Category;
        }
        return null;
    }

    public async addCategory(ent: Category): Promise<boolean>
    {
        await this.syncSubCategories(ent);
        let res = await CategoryModel.create(ent);
        return res != null;
    }

    public async bulkAddCategory(cats: Category[]): Promise<boolean>
    {
        for (let ii = 0; ii < cats.length; ii++)
        {
            await this.syncSubCategories(cats[ii]);
        }

        let res = await CategoryModel.create(cats);
        return res != null;
    }

    public async getAllCategories(): Promise<Category[]>
    {
        let res = await CategoryModel.find({});
        for (let ii = 0; ii < res.length; ii++)
        {
            await this.syncSubCategories(res[ii]);
        }

        return res;
    }

    public async wipeCategories(): Promise<boolean>
    {
        try
        {
            let res = await CategoryModel.deleteMany({});
            return res.ok ? true : false;
        }
        catch
        {
            return false;
        }
    }
}