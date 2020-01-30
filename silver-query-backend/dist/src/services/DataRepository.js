"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var DataRepository = /** @class */ (function () {
    function DataRepository() {
    }
    DataRepository.getDefaultCategoriesCollection = function () {
        return ({
            flat: [],
            graph: []
        });
    };
    DataRepository.getDefaultProductsCollection = function () {
        return ({
            byCategory: {}
        });
    };
    DataRepository.getDefaultProgress = function () {
        return ({
            atCatIndex: 0
        });
    };
    DataRepository.fileNameFromKey = function (key) {
        var fName = __dirname + "/../../data/" + key + ".json";
        return fName;
    };
    DataRepository.getObjectFromStorage = function (key) {
        var fName = this.fileNameFromKey(key);
        if (!fs_1.default.existsSync(fName))
            return null;
        var objStr = fs_1.default.readFileSync(fName, "utf8");
        if (objStr) {
            return JSON.parse(objStr);
        }
        return null;
    };
    DataRepository.saveObjectToStorage = function (key, obj) {
        var fName = this.fileNameFromKey(key);
        fs_1.default.writeFileSync(fName, JSON.stringify(obj), { encoding: "utf8" });
    };
    DataRepository.getCategoriesCollection = function () {
        var savedPos = this.getObjectFromStorage("categories");
        return savedPos ? savedPos : this.getDefaultCategoriesCollection();
    };
    DataRepository.getProductsCollection = function () {
        var savedPos = this.getObjectFromStorage("products");
        return savedPos ? savedPos : this.getDefaultProductsCollection();
    };
    DataRepository.getCrawlProgress = function () {
        var savedPos = this.getObjectFromStorage("progress");
        return savedPos ? savedPos : this.getDefaultProgress();
    };
    DataRepository.saveCategories = function (newCat) {
        this.saveObjectToStorage("categories", newCat);
    };
    DataRepository.saveProducts = function (newProd) {
        this.saveObjectToStorage("products", newProd);
    };
    DataRepository.saveCrawlProgress = function (prog) {
        this.saveObjectToStorage("progress", prog);
    };
    return DataRepository;
}());
exports.default = DataRepository;
//# sourceMappingURL=DataRepository.js.map