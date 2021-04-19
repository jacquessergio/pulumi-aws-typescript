"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
class Validator {
    static validConfigVariables(config) {
        if (config.require("api_name") == null || config.require("api_name") == undefined) {
            throw new Error("API name - cannot be null!");
        }
        if (config.require("lambda_authorization") == null || config.require("lambda_authorization") == undefined) {
            throw new Error("Lambda authorization Name cannot be null!");
        }
        if (config.require("lambda_execution_name") == null || config.require("lambda_execution_name") == undefined) {
            throw new Error("Lambda execution Name - cannot be null!");
        }
        if (config.require("db_url") == null || config.require("db_url") == undefined) {
            throw new Error("Database URL - cannot be null!");
        }
        if (config.require("revision_id") == null || config.require("revision_id") == undefined) {
            throw new Error("Deploy ID - cannot be null!");
        }
        if (config.require("certificate_arn") == null || config.require("certificate_arn") == undefined) {
            throw new Error("Certificate URN is required!");
        }
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map