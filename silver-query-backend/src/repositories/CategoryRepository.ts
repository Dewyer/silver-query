import { Category,CategoryModel } from "../models/database/CategoryModel";
import { Model } from "mongoose";
import { injectable } from "tsyringe";
import { ICategory } from "../models/Category";

@injectable()
export default class CategoryRepository
{

    constructor()
    {
    }

    private async categoryToICategory(cat:Category) : Promise<ICategory>
    {
        let subCatGraph:ICategory[ ] = [ ];
        for (let ii = 0; ii < cat.subCategories.length;ii++)
        {
            let subCatObj = await this.getCategoryOdmById(cat.subCategories[ii]);
            if (subCatObj)
                subCatGraph.push(await this.categoryToICategory(subCatObj))
        }

        return ({
            name:cat.name,
            id:cat._id.toHexString(),
            subCategories:subCatGraph,
            productsLink:cat.productsLink
        });
    }

    private async getCategoryOdmById(id: string): Promise<Category | null>
    {
        let res = await CategoryModel.findById(id).exec();
        if (res)
        {
            return res as Category;
        }
        return null;
    }

    public async getCategoryById(id:string) : Promise< ICategory | null>
    {
        let res = await this.getCategoryOdmById(id);
        if(res)
        {
            return await this.categoryToICategory(res);
        }
        return null;
    }

    public async addCategory(ent:ICategory) : Promise<boolean>
    {
        let res = await CategoryModel.create(ent);
        return res != null;
    }
    
    public async getAllCategories() : Promise<ICategory[ ]>
    {
        let res = await CategoryModel.find({});
        let allIcats:ICategory[ ] = [ ];

        for (let ii = 0; ii < res.length;ii++)
        {
            allIcats.push(await this.categoryToICategory(res[ii]));
        }

        return allIcats;
    }
}