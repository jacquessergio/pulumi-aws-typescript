'use strict';
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
exports.Response = void 0;
const aws = require("@pulumi/aws");
class Response {
    constructor(resource) {
        this.resource = resource;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.unauthorized();
            this.accessDenied();
            this.default4XX();
            this.default5XX();
        });
    }
    unauthorized() {
        this.template("UNAUTHORIZED", "401", "Invalid or expired token");
    }
    accessDenied() {
        this.template("ACCESS_DENIED", "401");
    }
    default4XX() {
        this.template("DEFAULT_4XX");
    }
    default5XX() {
        this.template("DEFAULT_5XX");
    }
    template(responseType, statusCode, message) {
        new aws.apigateway.Response(`response_${responseType}`, {
            restApiId: this.resource.restAPI.id,
            statusCode: statusCode,
            responseType: responseType,
            responseTemplates: {
                "application/json": (message != null || message != undefined) ? `{"message":"${message}"}` : `{"message":$context.error.messageString}`
            },
            responseParameters: this.getResponseParameters()
        });
    }
    getResponseParameters() {
        return {
            "gatewayresponse.header.Access-Control-Allow-Headers": "'access-control-allow-origin,authorization,content-type,x-change-password-token,x-refresh-session'",
            "gatewayresponse.header.Access-Control-Allow-Methods": "'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH'",
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'"
        };
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map