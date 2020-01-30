/// <reference types="cheerio" />
import { CategoriesCollection } from "../models/Categories";
import CategoryRepository from "../repositories/CategoryRepository";
import { Product } from "../models/database/ProductModel";
import ProductRepository from "../repositories/ProductRepository";
import CrawlProgressRepository from "../repositories/CrawlProgressRepository";
export default class CrawlerService {
    PROXY_URL: string;
    SILVERLAND: string;
    ERROR_MSG: string;
    _categoryRepository: CategoryRepository;
    _productRepository: ProductRepository;
    _crawlProgressRepository: CrawlProgressRepository;
    constructor();
    fetchHtmlWithProxy(site: string): Promise<string | null>;
    crawlCategories(): Promise<CategoriesCollection>;
    crawlProduct(productEl: CheerioElement): Promise<Product | null>;
    getProductHrefFromListElement(productEl: CheerioElement): string;
    isNoProductErrorPage(dd: CheerioStatic): boolean;
    crawlProducts(subSite: string): Promise<Product[]>;
    doCrawl(): Promise<void>;
    private sleep;
}
