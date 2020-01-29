"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var uuid_1 = __importDefault(require("uuid"));
var DataRepository_1 = __importDefault(require("./DataRepository"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var CrawlerService = /** @class */ (function () {
    function CrawlerService() {
    }
    CrawlerService.fetchHtmlWithProxy = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            var res, tt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default("" + encodeURI(site), {
                            method: "GET"
                        })];
                    case 1:
                        res = _a.sent();
                        if (!(res.status === 200)) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.text()];
                    case 2:
                        tt = _a.sent();
                        return [2 /*return*/, tt];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    CrawlerService.crawlCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resHtml, DD_1, levels, cats_1, flat_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHtmlWithProxy(this.SILVERLAND)];
                    case 1:
                        resHtml = _a.sent();
                        if (resHtml) {
                            DD_1 = cheerio_1.default.load(resHtml);
                            levels = [".menulist>li>a", ".menulist>li>ul>li>a", ".menulist>li>ul>li>ul>li>a"];
                            cats_1 = [];
                            flat_1 = [];
                            levels.forEach(function (level, levInd) {
                                DD_1(level).each(function (ii, doc) {
                                    var name = doc.childNodes[0].data;
                                    var id = doc.attribs["href"];
                                    var cat = {
                                        name: name,
                                        id: uuid_1.default.v4(),
                                        subCategories: [],
                                        productsLink: id
                                    };
                                    if (levInd !== 0) {
                                        var parent_1 = doc.parent.parent.parent.children[0].children[0].data;
                                        if (levInd === 1) {
                                            var parentCat = cats_1.find(function (x) { return x.name === parent_1; });
                                            if (parentCat) {
                                                parentCat.subCategories.push(cat);
                                            }
                                        }
                                        else {
                                            var what = cats_1.map(function (xx) { return xx.subCategories.find(function (ll) { return ll.name === parent_1; }); }).find(function (xx) { return xx !== undefined; });
                                            if (what) {
                                                what.subCategories.push(cat);
                                            }
                                        }
                                    }
                                    else if (levInd === 0) {
                                        cats_1.push(cat);
                                    }
                                    flat_1.push(cat);
                                });
                            });
                            return [2 /*return*/, {
                                    flat: flat_1,
                                    graph: cats_1
                                }];
                        }
                        return [2 /*return*/, { flat: [], graph: [] }];
                }
            });
        });
    };
    CrawlerService.crawlProduct = function (productEl) {
        return __awaiter(this, void 0, void 0, function () {
            var href, productHtml, DD, prod_1, desc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        href = this.getProductHrefFromListElement(productEl);
                        return [4 /*yield*/, this.fetchHtmlWithProxy(href)];
                    case 1:
                        productHtml = _a.sent();
                        if (productHtml) {
                            DD = cheerio_1.default.load(productHtml);
                            prod_1 = {
                                title: "",
                                priceHuf: 0,
                                productNumber: 0,
                                category: "",
                                description: "",
                                stockState: "other"
                            };
                            DD("#body>h2>em").each(function (ii, doc) {
                                if (prod_1.title === "") {
                                    prod_1.title = doc.children[0].data ? doc.children[0].data : "";
                                    prod_1.title = prod_1.title.trim();
                                    prod_1.title = prod_1.title.substring(0, prod_1.title.length - 2);
                                }
                            });
                            DD("#body>div>p").each(function (ii, doc) {
                                var fieldName = doc.children[0].data ? doc.children[0].data : "";
                                var fieldVal = "";
                                if (doc.children.length >= 2) {
                                    if (doc.children[1].children.length > 0)
                                        if (doc.children[1].children[0].data)
                                            fieldVal = doc.children[1].children[0].data;
                                }
                                if (fieldName.startsWith("Ár")) {
                                    prod_1.priceHuf = parseInt(fieldVal.trim().substring(0, fieldVal.length - 2));
                                }
                                if (fieldName.startsWith("Szállítás")) {
                                    if (fieldVal === "Raktárról") {
                                        prod_1.stockState = "in-stock";
                                    }
                                    else if (fieldVal === "Csak rendelésre") {
                                        prod_1.stockState = "order-only";
                                    }
                                }
                                if (fieldName.startsWith("Termékszám")) {
                                    prod_1.productNumber = parseInt(fieldName.split(":")[1].trim());
                                }
                            });
                            desc = DD("#body>div>p>span").first().html();
                            if (desc) {
                                prod_1.description = desc;
                            }
                            //console.log(prod);
                            return [2 /*return*/, prod_1];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    CrawlerService.getProductHrefFromListElement = function (productEl) {
        var href = "";
        productEl.children.forEach(function (xx) {
            if (xx.attribs)
                if (xx.attribs["class"] === "more") {
                    href = xx.children[1].attribs["href"];
                }
        });
        return href;
    };
    CrawlerService.isNoProductErrorPage = function (dd) {
        var _this = this;
        var found = false;
        dd("#body>p").each(function (ii, doc) {
            if (doc.children[0].data) {
                var text = doc.children[0].data;
                if (text.toLowerCase().includes(_this.ERROR_MSG.toLowerCase())) {
                    found = true;
                }
            }
        });
        return found;
    };
    CrawlerService.crawlProducts = function (subSite) {
        return __awaiter(this, void 0, void 0, function () {
            var prods, atPage, _loop_1, this_1, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getting products for: ", subSite);
                        prods = [];
                        atPage = 0;
                        _loop_1 = function () {
                            var finalUrl, siteHtml, DD, isError, allDocs_1, ii, prod;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        finalUrl = "" + this_1.SILVERLAND + subSite + "/" + atPage * 25;
                                        return [4 /*yield*/, this_1.fetchHtmlWithProxy(finalUrl)];
                                    case 1:
                                        siteHtml = _a.sent();
                                        if (!siteHtml) return [3 /*break*/, 6];
                                        DD = cheerio_1.default.load(siteHtml);
                                        isError = this_1.isNoProductErrorPage(DD);
                                        if (isError) {
                                            return [2 /*return*/, "break"];
                                        }
                                        allDocs_1 = [];
                                        DD("#body>div").each(function (ii, doc) {
                                            allDocs_1.push(doc);
                                        });
                                        ii = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(ii < allDocs_1.length)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this_1.crawlProduct(allDocs_1[ii])];
                                    case 3:
                                        prod = _a.sent();
                                        if (prod !== null)
                                            prods.push(prod);
                                        _a.label = 4;
                                    case 4:
                                        ii++;
                                        return [3 /*break*/, 2];
                                    case 5: return [3 /*break*/, 7];
                                    case 6: return [2 /*return*/, "break"];
                                    case 7:
                                        console.log("at page: ", atPage);
                                        atPage++;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        state_1 = _a.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 3];
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, []];
                }
            });
        });
    };
    CrawlerService.doCrawl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var categoriesCol, productsCol, progress, _loop_2, this_2, ii;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Start crawl.");
                        return [4 /*yield*/, this.crawlCategories()];
                    case 1:
                        categoriesCol = _a.sent();
                        DataRepository_1.default.saveCategories(categoriesCol);
                        productsCol = DataRepository_1.default.getProductsCollection();
                        progress = DataRepository_1.default.getCrawlProgress();
                        _loop_2 = function (ii) {
                            var thisCat, productsInThisCat;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        thisCat = categoriesCol.flat[ii];
                                        console.log(thisCat.name, " at cat ", ii, " / ", categoriesCol.flat.length);
                                        if (!(thisCat.productsLink !== "#")) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_2.crawlProducts(categoriesCol.flat[ii].productsLink)];
                                    case 1:
                                        productsInThisCat = _a.sent();
                                        productsInThisCat.forEach(function (xx) { return xx.category = thisCat.id; });
                                        productsCol.byCategory[thisCat.id] = productsInThisCat;
                                        _a.label = 2;
                                    case 2:
                                        DataRepository_1.default.saveProducts(productsCol);
                                        progress.atCatIndex = ii + 1;
                                        DataRepository_1.default.saveCrawlProgress(progress);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        ii = progress.atCatIndex;
                        _a.label = 2;
                    case 2:
                        if (!(ii < categoriesCol.flat.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_2(ii)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        ii++;
                        return [3 /*break*/, 2];
                    case 5:
                        DataRepository_1.default.saveProducts(productsCol);
                        console.log("saved everything");
                        return [2 /*return*/];
                }
            });
        });
    };
    CrawlerService.sleep = function (ms) {
        return new Promise(function (a, b) { setTimeout(function () { a(); }, ms); });
    };
    CrawlerService.PROXY_URL = "https://cors-anywhere.herokuapp.com/";
    CrawlerService.SILVERLAND = "http://www.silverland.hu";
    CrawlerService.ERROR_MSG = "Nincs megjeleníthető termék.";
    return CrawlerService;
}());
exports.default = CrawlerService;
//# sourceMappingURL=CrawlerService.js.map