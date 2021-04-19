"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const pulumi = require("@pulumi/pulumi");
const Validator_1 = require("../utils/Validator");
class Environment {
    static config() {
        let environment = new pulumi.Config();
        Validator_1.Validator.validConfigVariables(environment);
        let gateway = {
            apiName: environment.require("api_name"),
            revisionId: environment.require("revision_id"),
            authorization: environment.require("lambda_authorization"),
            eventHanlder: environment.require("lambda_execution_name"),
            pgConnectionString: environment.require("pg_connection_string"),
            certificateArn: environment.require("certificate_arn"),
            environment: environment.require("environment")
        };
        return gateway;
    }
}
exports.Environment = Environment;
//# sourceMappingURL=Environment.js.map