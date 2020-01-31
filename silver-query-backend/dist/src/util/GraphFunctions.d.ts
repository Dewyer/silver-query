import { Category } from "../models/database/CategoryModel";
export default abstract class GraphFunctions {
    private static getCategoriesFromSubs;
    static getFlatCategoriesFromGraph(graph: Category[]): Category[];
}
