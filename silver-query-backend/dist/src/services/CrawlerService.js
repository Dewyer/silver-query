"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const tsyringe_1 = require("tsyringe");
const CategoryRepository_1 = __importDefault(require("../repositories/CategoryRepository"));
const CategoryModel_1 = require("../models/database/CategoryModel");
const mongoose_1 = require("mongoose");
const ProductModel_1 = require("../models/database/ProductModel");
const ProductRepository_1 = __importDefault(require("../repositories/ProductRepository"));
const CrawlProgressRepository_1 = __importDefault(require("../repositories/CrawlProgressRepository"));
let CrawlerService = class CrawlerService {
    constructor() {
        this.PROXY_URL = "https://cors-anywhere.herokuapp.com/";
        this.SILVERLAND = "http://www.silverland.hu";
        this.ERROR_MSG = "Nincs megjeleníthető termék.";
        this._categoryRepository = tsyringe_1.container.resolve(CategoryRepository_1.default);
        this._productRepository = tsyringe_1.container.resolve(ProductRepository_1.default);
        this._crawlProgressRepository = tsyringe_1.container.resolve(CrawlProgressRepository_1.default);
    }
    fetchHtmlWithProxy(site) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield node_fetch_1.default(`${encodeURI(site)}`, {
                method: "GET"
            });
            if (res.status === 200) {
                let tt = yield res.text();
                return tt;
            }
            return null;
        });
    }
    crawlCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            let resHtml = yield this.fetchHtmlWithProxy(this.SILVERLAND);
            if (resHtml) {
                let DD = cheerio_1.default.load(resHtml);
                let levels = [".menulist>li>a", ".menulist>li>ul>li>a", ".menulist>li>ul>li>ul>li>a"];
                let cats = [];
                let flat = [];
                levels.forEach((level, levInd) => {
                    DD(level).each((ii, doc) => {
                        let name = doc.childNodes[0].data;
                        let id = doc.attribs["href"];
                        let cat = new CategoryModel_1.CategoryModel({
                            name: name,
                            _id: new mongoose_1.Types.ObjectId(),
                            subCategoriesIds: [],
                            productsLink: id
                        });
                        cat.subCategories = [];
                        if (levInd !== 0) {
                            let parent = doc.parent.parent.parent.children[0].children[0].data;
                            if (levInd === 1) {
                                let parentCat = cats.find(x => x.name === parent);
                                if (parentCat) {
                                    parentCat.subCategories.push(cat);
                                }
                            }
                            else {
                                let what = cats.map(xx => xx.subCategories.find(ll => ll.name === parent)).find(xx => xx !== undefined);
                                if (what) {
                                    what.subCategories.push(cat);
                                }
                            }
                        }
                        else if (levInd === 0) {
                            cats.push(cat);
                        }
                        flat.push(cat);
                    });
                });
                return {
                    flat: flat,
                    graph: cats
                };
            }
            return { flat: [], graph: [] };
        });
    }
    crawlProduct(productEl) {
        return __awaiter(this, void 0, void 0, function* () {
            let href = this.getProductHrefFromListElement(productEl);
            let productHtml = yield this.fetchHtmlWithProxy(href);
            if (productHtml) {
                let DD = cheerio_1.default.load(productHtml);
                let prod = new ProductModel_1.ProductModel({
                    title: "",
                    priceHuf: 0,
                    productNumber: 0,
                    categoryId: "",
                    description: "",
                    stockState: "other",
                    silverUrl: encodeURI(href)
                });
                DD("#body>h2>em").each((ii, doc) => {
                    if (prod.title === "") {
                        prod.title = doc.children[0].data ? doc.children[0].data : "";
                        prod.title = prod.title.trim();
                        prod.title = prod.title.substring(0, prod.title.length - 2);
                    }
                });
                DD("#body>div>p").each((ii, doc) => {
                    let fieldName = doc.children[0].data ? doc.children[0].data : "";
                    let fieldVal = "";
                    if (doc.children.length >= 2) {
                        if (doc.children[1].children.length > 0)
                            if (doc.children[1].children[0].data)
                                fieldVal = doc.children[1].children[0].data;
                    }
                    if (fieldName.startsWith("Ár")) {
                        prod.priceHuf = parseInt(fieldVal.trim().substring(0, fieldVal.length - 2));
                    }
                    if (fieldName.startsWith("Szállítás")) {
                        if (fieldVal === "Raktárról") {
                            prod.stockState = "in-stock";
                        }
                        else if (fieldVal === "Csak rendelésre") {
                            prod.stockState = "order-only";
                        }
                    }
                    if (fieldName.startsWith("Termékszám")) {
                        prod.productNumber = parseInt(fieldName.split(":")[1].trim());
                    }
                });
                let desc = DD("#body>div>p>span").first().html();
                if (desc) {
                    prod.description = desc;
                }
                //console.log(prod);
                return prod;
            }
            return null;
        });
    }
    getProductHrefFromListElement(productEl) {
        let href = "";
        productEl.children.forEach(xx => {
            if (xx.attribs)
                if (xx.attribs["class"] === "more") {
                    href = xx.children[1].attribs["href"];
                }
        });
        return href;
    }
    isNoProductErrorPage(dd) {
        let found = false;
        dd("#body>p").each((ii, doc) => {
            if (doc.children[0].data) {
                let text = doc.children[0].data;
                if (text.toLowerCase().includes(this.ERROR_MSG.toLowerCase())) {
                    found = true;
                }
            }
        });
        return found;
    }
    crawlProducts(subSite) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getting products for: ", subSite);
            let prods = [];
            let atPage = 0;
            while (true) {
                let finalUrl = `${this.SILVERLAND}${subSite}/${atPage * 25}`;
                let siteHtml = yield this.fetchHtmlWithProxy(finalUrl);
                if (siteHtml) {
                    let DD = cheerio_1.default.load(siteHtml);
                    let isError = this.isNoProductErrorPage(DD);
                    if (isError) {
                        break;
                    }
                    let allDocs = [];
                    DD("#body>div").each((ii, doc) => {
                        allDocs.push(doc);
                    });
                    for (let ii = 0; ii < allDocs.length; ii++) {
                        let prod = yield this.crawlProduct(allDocs[ii]);
                        if (prod !== null)
                            prods.push(prod);
                    }
                }
                else {
                    break;
                }
                console.log("at page: ", atPage);
                atPage++;
            }
            return prods;
        });
    }
    doCrawl() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Start crawl.");
            let categoriesCol = yield this.crawlCategories();
            let didWipe = yield this._categoryRepository.wipeCategories();
            yield this._categoryRepository.bulkAddCategory(categoriesCol.flat);
            let progress = yield this._crawlProgressRepository.getActiveProgress();
            for (let ii = progress.atCategoryIndex; ii < categoriesCol.flat.length; ii++) {
                let thisCat = categoriesCol.flat[ii];
                console.log(thisCat.name, " at cat ", ii, " / ", categoriesCol.flat.length);
                if (thisCat.productsLink !== "#") {
                    let productsInThisCat = yield this.crawlProducts(categoriesCol.flat[ii].productsLink);
                    productsInThisCat.forEach(xx => xx.categoryId = thisCat._id.toHexString());
                    yield this._productRepository.bulkAddProduct(productsInThisCat);
                }
                progress.atCategoryIndex = ii + 1;
                yield this._crawlProgressRepository.updateCrawlProgress(progress);
            }
            console.log("saved everything");
        });
    }
    sleep(ms) {
        return new Promise((a, b) => { setTimeout(() => { a(); }, ms); });
    }
};
CrawlerService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], CrawlerService);
exports.default = CrawlerService;
//# sourceMappingURL=CrawlerService.js.map