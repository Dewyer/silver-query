import { Category } from "../models/database/CategoryModel";
export default class CategoryRepository {
    constructor();
    syncSubCategories(cat: Category): Promise<void>;
    getCategoryById(id: string): Promise<Category | null>;
    addCategory(ent: Category): Promise<boolean>;
    bulkAddCategory(cats: Category[]): Promise<boolean>;
    getAllCategories(): Promise<Category[]>;
    wipeCategories(): Promise<boolean>;
}
