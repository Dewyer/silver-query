---
to: src/repositories/<%= name %>Repository.ts
---
import { <%= name %>,<%= name %>Model } from "../models/database/<%= name %>Model";
import { Model } from "mongoose";
import { injectable } from "tsyringe";

@injectable()
export default class <%= name %>Repository
{

    constructor()
    {
    }

    public async get<%= name %>ById(id:string) : Promise< <%= name %> | null>
    {
        let res = await <%= name %>Model.findById(id).exec();
        if(res)
        {
            return res as <%= name %>;
        }
        return null;
    }

    public async add<%= name %>(ent:<%= name %>) : Promise<boolean>
    {
        let res = await <%= name %>Model.create(ent);
        return res != null;
    }
    
    public async getAll<%= name %>s() : Promise<<%= name %>[ ]>
    {
        let res = await <%= name %>Model.find({});
        return res;
    }
}