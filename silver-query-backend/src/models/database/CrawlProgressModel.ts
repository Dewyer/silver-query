import { prop, Typegoose, ModelType, InstanceType, Ref } from '@hasezoey/typegoose';
import * as mongoose from 'mongoose';

export class CrawlProgress extends Typegoose
{
    _id!: mongoose.Types.ObjectId;

    @prop({required:true})
    atCategoryIndex!:number;

    @prop({required:true})
    dbHash!:string;
}

export const CrawlProgressModel = new CrawlProgress().getModelForClass(CrawlProgress, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'crawlprogresss' }
})