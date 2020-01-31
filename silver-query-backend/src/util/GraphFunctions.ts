import { Category} from "../models/database/CategoryModel";

export default abstract class GraphFunctions
{

    private static getCategoriesFromSubs(cat:Category) : Category[ ]
    {
        let allSubs = [ ];

        for (let ii = 0; ii < cat.subCategories!.length;ii++)
        {
            allSubs.push(cat.subCategories![ii]);
            allSubs = allSubs.concat(this.getCategoriesFromSubs(cat.subCategories![ii]));
        }

        return allSubs;
    }

    public static getFlatCategoriesFromGraph(graph:Category[ ])
    {
        let allSubs:Category[ ] = Array.from(graph);

        for (let ii =0; ii < graph.length;ii++)
        {
            allSubs = allSubs.concat(this.getCategoriesFromSubs(graph[ii]));
        }

        return allSubs;
    }

}