"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const http_status_codes_1 = require("http-status-codes");
function validationMiddleware(type) {
    return (req, res, next) => {
        class_validator_1.validate(class_transformer_1.plainToClass(type, req.body))
            .then((errors) => {
            if (errors.length > 0) {
                res.status(http_status_codes_1.BAD_REQUEST).json(errors);
            }
            else {
                next();
            }
        });
    };
}
exports.default = validationMiddleware;
//# sourceMappingURL=validation.js.map