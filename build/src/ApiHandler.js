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
const pulumi = require("@pulumi/pulumi");
const Authorizer_1 = require("./config/Authorizer");
const APIDao_1 = require("./dao/APIDao");
const CustomDomain_1 = require("./config/CustomDomain");
const Response_1 = require("./config/Response");
const CORS_1 = require("./config/CORS");
const path_1 = require("path");
class ApiHandler {
    constructor(config) {
        this.apiName = config.apiName;
        this.apiData = new APIDao_1.APIDao().query(config.revisionId);
        this.certificateArn = config.certificateArn;
        this.authorizer = this.getAuthorizer(config.authorization);
        this.eventHandler = this.getEventHandler(config.eventHanlder);
        this.t();
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
    t() {
        const account = pulumi.output(aws.getCallerIdentity({ async: true })).accountId;
        const createTodoFunctionName = `${this.apiName}-dev-function`;
        /**
         * IAM Role
         */
        const executionRoleName = `${this.apiName}-policy`;
        const executionRole = new aws.iam.Role(executionRoleName, {
            name: executionRoleName,
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: "lambda.amazonaws.com"
            }),
            tags: {
                Environment: "dev"
            }
        });
        const executionRolePolicyName = `${executionRoleName}-policy`;
        const rolePolicy = new aws.iam.RolePolicy(executionRolePolicyName, {
            name: executionRolePolicyName,
            role: executionRole,
            policy: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Action: [
                            "logs:CreateLogGroup",
                            "logs:CreateLogStream",
                            "logs:PutLogEvents",
                        ],
                        Resource: account.apply((accountId) => `arn:aws:logs:${aws.config.region}:${accountId}:log-group:/aws/lambda/${createTodoFunctionName}*`)
                    }
                ]
            }
        });
        /**
         * Code Archive & Lambda layer
         */
        const code = new pulumi.asset.AssetArchive({
            ".": new pulumi.asset.FileArchive(this.relativeRootPath("build/archive.zip"))
        });
        const zipFile = this.relativeRootPath("layers/archive.zip");
        const nodeModuleLambdaLayerName = `${createTodoFunctionName}-lambda-layer-nodemodules`;
        const nodeModuleLambdaLayer = new aws.lambda.LayerVersion(nodeModuleLambdaLayerName, {
            compatibleRuntimes: [aws.lambda.NodeJS12dXRuntime],
            code: new pulumi.asset.FileArchive(zipFile),
            layerName: nodeModuleLambdaLayerName
        });
        new aws.lambda.Function(createTodoFunctionName, {
            name: createTodoFunctionName,
            runtime: aws.lambda.NodeJS12dXRuntime,
            handler: './config/Function.handler',
            role: executionRole.arn,
            code,
            memorySize: 128,
            layers: [nodeModuleLambdaLayer.arn],
        });
    }
    relativeRootPath(path) {
        return path_1.join(process.cwd(), "..", path);
    }
}
exports.ApiHandler = ApiHandler;
//# sourceMappingURL=ApiHandler.js.map