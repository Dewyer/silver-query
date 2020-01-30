import { CrawlProgress,CrawlProgressModel } from "../models/database/CrawlProgressModel";
import { Model } from "mongoose";
import { injectable } from "tsyringe";
import * as mongoose from "mongoose";
import uuid = require("uuid");

@injectable()
export default class CrawlProgressRepository
{

    constructor()
    {
    }

    private getDefaultCrawlProgress() : CrawlProgress
    {
        let kk = new CrawlProgressModel({
            atCategoryIndex:0,
            dbHash:"-"
        });
        return kk;
    }

    private async getCrawlProgressById(id:string) : Promise< CrawlProgress | null>
    {
        let res = await CrawlProgressModel.findById(id).exec();
        if(res)
        {
            return res as CrawlProgress;
        }
        return null;
    }

    private async addCrawlProgress(ent:CrawlProgress) : Promise<boolean>
    {
        let res = await CrawlProgressModel.create(ent);
        return res != null;
    }
    
    private async getAllCrawlProgresss() : Promise<CrawlProgress[ ]>
    {
        let res = await CrawlProgressModel.find({});
        return res;
    }

    public async resetCrawlProgress()
    {
        await CrawlProgressModel.remove({});
    }

    public async updateCrawlProgress(prog:CrawlProgress)
    {
        await CrawlProgressModel.update({id:prog._id.toHexString()},prog);
    }

    public async getActiveProgress() : Promise<CrawlProgress>
    {
        let rr = await this.getAllCrawlProgresss();

        if (rr.length === 0)
        {
            let cc = this.getDefaultCrawlProgress();
            await this.addCrawlProgress(cc);
            return cc;
        }
        else
        {
            return rr[0];
        }
    }
}