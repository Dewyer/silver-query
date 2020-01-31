"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphFunctions {
    static getCategoriesFromSubs(cat) {
        let allSubs = [];
        for (let ii = 0; ii < cat.subCategories.length; ii++) {
            allSubs.push(cat.subCategories[ii]);
            allSubs = allSubs.concat(this.getCategoriesFromSubs(cat.subCategories[ii]));
        }
        return allSubs;
    }
    static getFlatCategoriesFromGraph(graph) {
        let allSubs = Array.from(graph);
        for (let ii = 0; ii < graph.length; ii++) {
            allSubs = allSubs.concat(this.getCategoriesFromSubs(graph[ii]));
        }
        return allSubs;
    }
}
exports.default = GraphFunctions;
//# sourceMappingURL=GraphFunctions.js.map