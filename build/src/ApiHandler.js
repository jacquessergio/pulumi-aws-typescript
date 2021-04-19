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
exports.ApiHandler = void 0;
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const Authorizer_1 = require("./config/Authorizer");
const APIDao_1 = require("./dao/APIDao");
const CustomDomain_1 = require("./config/CustomDomain");
const Response_1 = require("./config/Response");
const CORS_1 = require("./config/CORS");
const LambdaFunction_1 = require("./config/LambdaFunction");
class ApiHandler {
    constructor(config) {
        this.apiName = config.apiName;
        this.environment = config.environment;
        this.apiData = new APIDao_1.APIDao().query(config.revisionId);
        this.certificateArn = config.certificateArn;
        this.authorizer = this.getAuthorizer(config.authorization);
        this.eventHandler = this.createLambdaFunction();
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getApiData();
            let apiCreated = new awsx.apigateway.API(this.apiName, {
                requestValidator: 'PARAMS_ONLY',
                routes: yield this.getRoutesTemplate(),
                stageName: data.environment,
                restApiArgs: {
                    description: `Description for api ${this.apiName}`,
                    endpointConfiguration: {
                        types: 'REGIONAL'
                    }
                }
            });
            this.setApiConfig(apiCreated, data);
            return apiCreated.urn;
        });
    }
    getRoutesTemplate() {
        let reources = [];
        return this.apiData.then(resource => {
            resource === null || resource === void 0 ? void 0 : resource.forEach(item => {
                let isAuth = true;
                if (item.auth_scheme == 'None') {
                    isAuth = false;
                }
                const path = item.api_version + item.url_pattern;
                reources.push({
                    path: path,
                    method: item.http_method,
                    eventHandler: this.eventHandler,
                    authorizers: (!isAuth) ? [] : this.authorizer,
                    requiredParameters: (isAuth == false) ? [] : [{ name: "Authorization", in: "header" }]
                });
            });
            return reources;
        });
    }
    getApiData() {
        return this.apiData.then((result) => {
            let data = result[0];
            return {
                host: data.vhost,
                environment: data.label,
                basePath: data.context_template
            };
        });
    }
    getPathFromResources() {
        return this.apiData.then((result) => {
            let reources = [];
            result.forEach((resource) => {
                reources.push({
                    path: resource.api_version + resource.url_pattern
                });
            });
            return reources;
        });
    }
    setApiConfig(apiCreated, apiData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setConfigGatewayResponse(apiCreated);
            this.setCustomDomain(apiData.host, apiCreated, apiData.basePath);
            this.setConfigCORS(apiCreated);
        });
    }
    setConfigCORS(apiResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const cors = new CORS_1.CORS(apiResponse);
            const paths = yield this.getPathFromResources();
            paths.forEach(item => {
                cors.execute(item.path);
            });
        });
    }
    setConfigGatewayResponse(api) {
        new Response_1.Response(api).execute();
    }
    setCustomDomain(url, api, basePath) {
        new CustomDomain_1.CustomDomain(url, api, basePath.replace('/', ''), this.certificateArn).execute();
    }
    getAuthorizer(authorizerName) {
        return new Authorizer_1.ApiAuthorizer(authorizerName).get();
    }
    getEventHandler(lambdaName) {
        return aws.lambda.Function.get(lambdaName, lambdaName);
    }
    createLambdaFunction() {
        let lambda = new LambdaFunction_1.LambdaFunction(this.apiName, this.environment);
        return lambda.execute();
    }
}
exports.ApiHandler = ApiHandler;
//# sourceMappingURL=ApiHandler.js.map