import "reflect-metadata";

import CrawlerService from "./services/CrawlerService";
import { container } from "tsyringe";

async function main()
{
    let crawler = container.resolve(CrawlerService);
    await crawler.doCrawl();
}

main();