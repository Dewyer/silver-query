import { Category } from "./database/CategoryModel";
export interface CategoriesCollection {
    flat: Category[];
    graph: Category[];
}
