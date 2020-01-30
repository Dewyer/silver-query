import "reflect-metadata";

import CrawlerService from "./services/CrawlerService";
import { container } from "tsyringe";
import MainDatabaseContext from "./data/MainDatabaseContext";

async function main()
{
    let mongo = container.resolve(MainDatabaseContext);
    await mongo.initDb();
    let crawler = container.resolve(CrawlerService);
    await crawler.doCrawl();
}

main().then().catch((ex)=>{
    console.log(ex);
});