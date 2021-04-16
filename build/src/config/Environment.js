"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const pulumi = require("@pulumi/pulumi");
const Validator_1 = require("../utils/Validator");
class Environment {
    static config() {
        let enviroment = new pulumi.Config();
        Validator_1.Validator.validConfigVariables(enviroment);
        let gateway = {
            apiName: enviroment.require("api_name"),
            revisionId: enviroment.require("revision_id"),
            authorization: enviroment.require("lambda_authorization"),
            eventHanlder: enviroment.require("lambda_execution_name"),
            pgConnectionString: enviroment.require("pg_connection_string"),
            certificateArn: enviroment.require("certificate_arn")
        };
        return gateway;
    }
}
exports.Environment = Environment;
//# sourceMappingURL=Environment.js.map