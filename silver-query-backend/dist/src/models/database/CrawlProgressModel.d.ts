import { Typegoose, InstanceType } from '@hasezoey/typegoose';
import * as mongoose from 'mongoose';
export declare class CrawlProgress extends Typegoose {
    _id: mongoose.Types.ObjectId;
    atCategoryIndex: number;
    dbHash: string;
}
export declare const CrawlProgressModel: mongoose.Model<InstanceType<CrawlProgress>, {}> & CrawlProgress & typeof CrawlProgress;
