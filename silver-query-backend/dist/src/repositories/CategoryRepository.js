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
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryModel_1 = require("../models/database/CategoryModel");
const tsyringe_1 = require("tsyringe");
let CategoryRepository = class CategoryRepository {
    constructor() {
    }
    syncSubCategories(cat) {
        return __awaiter(this, void 0, void 0, function* () {
            if (cat.subCategories) {
                for (let ii = 0; ii < cat.subCategories.length; ii++) {
                    if (!cat.subCategoriesIds.includes(cat._id.toHexString())) {
                        cat.subCategoriesIds.push(cat._id.toHexString());
                    }
                }
                for (let ii = 0; ii < cat.subCategoriesIds.length; ii++) {
                    if (!cat.subCategories.some(xx => xx._id.toHexString() === cat.subCategoriesIds[ii])) {
                        let kk = yield this.getCategoryById(cat.subCategoriesIds[ii]);
                        if (kk)
                            cat.subCategories.push(kk);
                    }
                }
            }
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield CategoryModel_1.CategoryModel.findById(id).exec();
            if (res) {
                yield this.syncSubCategories(res);
                return res;
            }
            return null;
        });
    }
    addCategory(ent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.syncSubCategories(ent);
            let res = yield CategoryModel_1.CategoryModel.create(ent);
            return res != null;
        });
    }
    bulkAddCategory(cats) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let ii = 0; ii < cats.length; ii++) {
                yield this.syncSubCategories(cats[ii]);
            }
            let res = yield CategoryModel_1.CategoryModel.create(cats);
            return res != null;
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield CategoryModel_1.CategoryModel.find({});
            for (let ii = 0; ii < res.length; ii++) {
                yield this.syncSubCategories(res[ii]);
            }
            return res;
        });
    }
    wipeCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield CategoryModel_1.CategoryModel.deleteMany({});
                return res.ok ? true : false;
            }
            catch (_a) {
                return false;
            }
        });
    }
};
CategoryRepository = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [])
], CategoryRepository);
exports.default = CategoryRepository;
//# sourceMappingURL=CategoryRepository.js.map