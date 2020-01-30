import { CategoriesCollection } from "../models/Categories";
import { ProductsCollection } from "../models/ProductsCollection";
import { CrawlProgress } from "../models/CrawlProgress";
export default abstract class DataRepository {
    private static getDefaultCategoriesCollection;
    private static getDefaultProductsCollection;
    private static getDefaultProgress;
    private static fileNameFromKey;
    private static getObjectFromStorage;
    static saveObjectToStorage(key: string, obj: any): void;
    static getCategoriesCollection(): CategoriesCollection;
    static getProductsCollection(): ProductsCollection;
    static getCrawlProgress(): CrawlProgress;
    static saveCategories(newCat: CategoriesCollection): void;
    static saveProducts(newProd: ProductsCollection): void;
    static saveCrawlProgress(prog: CrawlProgress): void;
}
