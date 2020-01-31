"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const controllers = __importStar(require("./controllers"));
const core_1 = require("@overnightjs/core");
const logger_1 = require("@overnightjs/logger");
const error_1 = __importDefault(require("./middleware/error"));
const express_1 = __importDefault(require("express"));
class NormalRouterServer extends core_1.Server {
    constructor() {
        super(true);
        this.FRONT_END_MSG = 'OvernightJS with standard express router started.';
        this.START_MSG = 'OvernightJS with standard express router started on port: ';
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use("/", express_1.default.static("public"));
        this.setupControllers();
        this.app.get("*", (req, res) => {
            res.sendFile(process.cwd() + '/public/index.html');
        });
        this.app.use(error_1.default);
    }
    setupControllers() {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = controllers[name];
            if (typeof controller === 'function') {
                controllerInstances.push(new controller());
            }
        }
        super.addControllers(controllerInstances);
    }
    start(port) {
        port = port || 4200;
        this.app.get('*', (req, res) => {
            res.send(this.FRONT_END_MSG);
        });
        this.app.listen(port, () => {
            logger_1.Logger.Imp(this.START_MSG + port);
        });
    }
}
exports.default = NormalRouterServer;
//# sourceMappingURL=NormalRouterServer.js.map