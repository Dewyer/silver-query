---
to: src/models/database/<%= name %>Model.ts
---
import { prop, Typegoose, ModelType, InstanceType, Ref } from 'typegoose';
import * as mongoose from 'mongoose';

export class <%= name %> extends Typegoose
{
    _id!: mongoose.Types.ObjectId;

}

export const <%= name %>Model = new <%= name %>().getModelForClass(<%= name %>, {
    existingMongoose: mongoose,
    schemaOptions: { collection: '<%= h.changeCase.lower(name) %>s' }
})