import { container, injectable } from "tsyringe";
import { ConfigurationData } from "../models/config";
import config from "../../config.json";

@injectable()
export default class ConfigurationService
{

    constructor()
    {

    }   

    getConfiguration() : ConfigurationData
    {
        return (config as ConfigurationData);
    }

}