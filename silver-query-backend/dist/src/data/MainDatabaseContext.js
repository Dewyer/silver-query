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
const tsyringe_1 = require("tsyringe");
const mongoose_1 = __importDefault(require("mongoose"));
const ConfigurationService_1 = __importDefault(require("../services/ConfigurationService"));
let MainDatabaseContext = class MainDatabaseContext {
    constructor() {
        this._config = tsyringe_1.container.resolve(ConfigurationService_1.default).getConfiguration();
    }
    initDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(this._config.dbConString);
                yield mongoose_1.default.connect(this._config.dbConString, { useNewUrlParser: true, useUnifiedTopology: true });
                return true;
            }
            catch (ex) {
                console.log(ex);
                return false;
            }
        });
    }
};
MainDatabaseContext = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], MainDatabaseContext);
exports.default = MainDatabaseContext;
//# sourceMappingURL=MainDatabaseContext.js.map