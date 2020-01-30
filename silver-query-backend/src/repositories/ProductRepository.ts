import { Product,ProductModel } from "../models/database/ProductModel";
import { Model } from "mongoose";
import { injectable } from "tsyringe";

@injectable()
export default class ProductRepository
{

    constructor()
    {
    }

    public async getProductById(id:string) : Promise< Product | null>
    {
        let res = await ProductModel.findById(id).exec();
        if(res)
        {
            return res as Product;
        }
        return null;
    }

    public async addProduct(ent:Product) : Promise<boolean>
    {
        let res = await ProductModel.create(ent);
        return res != null;
    }
    
    public async getAllProducts() : Promise<Product[ ]>
    {
        let res = await ProductModel.find({});
        return res;
    }

    public async bulkAddProduct(cats: Product[]): Promise<boolean>
    {
        let res = await ProductModel.create(cats);
        return res != null;
    }
}