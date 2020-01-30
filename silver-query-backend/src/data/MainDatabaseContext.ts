import { singleton, container } from "tsyringe";
import mongoose from 'mongoose';
import { ConfigurationData } from "../models/config";
import ConfigurationService from "../services/ConfigurationService";

@singleton()
export default class MainDatabaseContext
{
    private _config: ConfigurationData;

    constructor()
    {
        this._config = container.resolve(ConfigurationService).getConfiguration();
    }

    async initDb(): Promise<boolean>
    {
        try
        {
            await mongoose.connect(this._config.dbConString, { useNewUrlParser: true, useUnifiedTopology: true });
            return true;
        }
        catch (ex)
        {
            console.log(ex);
            return false;
        }
    }
}