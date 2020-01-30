/// <reference types="cheerio" />
import { Product } from "../models/Product";
import { CategoriesCollection } from "../models/Categories";
export default class CrawlerService {
    PROXY_URL: string;
    SILVERLAND: string;
    ERROR_MSG: string;
    fetchHtmlWithProxy(site: string): Promise<string | null>;
    crawlCategories(): Promise<CategoriesCollection>;
    crawlProduct(productEl: CheerioElement): Promise<Product | null>;
    getProductHrefFromListElement(productEl: CheerioElement): string;
    isNoProductErrorPage(dd: CheerioStatic): boolean;
    crawlProducts(subSite: string): Promise<Product[]>;
    doCrawl(): Promise<void>;
    private sleep;
}
