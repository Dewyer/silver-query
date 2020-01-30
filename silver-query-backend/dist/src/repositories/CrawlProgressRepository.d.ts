import { CrawlProgress } from "../models/database/CrawlProgressModel";
export default class CrawlProgressRepository {
    constructor();
    private getDefaultCrawlProgress;
    private getCrawlProgressById;
    private addCrawlProgress;
    private getAllCrawlProgresss;
    resetCrawlProgress(): Promise<void>;
    updateCrawlProgress(prog: CrawlProgress): Promise<void>;
    getActiveProgress(): Promise<CrawlProgress>;
}
