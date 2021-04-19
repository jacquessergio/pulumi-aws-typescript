'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFunction = void 0;
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
const path_1 = require("path");
const lower_case_1 = require("lower-case");
class LambdaFunction {
    constructor(apiData) {
        console.log(apiData);
        this.apiName = lower_case_1.lowerCase(apiData.name);
        this.baseUrl = lower_case_1.lowerCase(apiData.host);
        this.environment = lower_case_1.lowerCase(apiData.environment);
    }
    execute() {
        const createTodoFunctionName = `proxy-${this.apiName}-${this.environment}-function`;
        /**
         * Code Archive & Lambda layer
         */
        const code = new pulumi.asset.AssetArchive({
            ".": new pulumi.asset.FileArchive(this.relativeRootPath("build/archive.zip"))
        });
        const zipFile = this.relativeRootPath("layers/archive.zip");
        const nodeModuleLambdaLayerName = `${createTodoFunctionName}-layer-nodemodules`;
        const nodeModuleLambdaLayer = new aws.lambda.LayerVersion(nodeModuleLambdaLayerName, {
            compatibleRuntimes: [aws.lambda.NodeJS12dXRuntime],
            code: new pulumi.asset.FileArchive(zipFile),
            layerName: nodeModuleLambdaLayerName
        });
        return new aws.lambda.Function(createTodoFunctionName, {
            name: createTodoFunctionName,
            runtime: aws.lambda.NodeJS12dXRuntime,
            handler: './src/functions/Handler.proxy',
            role: this.createAndGetRole(createTodoFunctionName).arn,
            code,
            memorySize: 1024,
            layers: [nodeModuleLambdaLayer.arn],
            environment: {
                variables: {
                    stage: `${this.environment}`,
                    base_url: `${this.baseUrl}`
                }
            },
            tags: {
                Name: `${createTodoFunctionName}`,
                Environment: `${this.environment}`
            }
        });
    }
    createAndGetRole(functionName) {
        const executionRoleName = `${this.apiName}-role`;
        const executionRole = new aws.iam.Role(executionRoleName, {
            name: executionRoleName,
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: "lambda.amazonaws.com"
            }),
            tags: {
                Environment: `${this.environment}`,
            }
        });
        this.createPolicy(executionRoleName, executionRole, functionName);
        return executionRole;
    }
    createPolicy(executionRoleName, executionRole, functionName) {
        const account = pulumi.output(aws.getCallerIdentity({ async: true })).accountId;
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
                        Resource: account.apply((accountId) => `arn:aws:logs:${aws.config.region}:${accountId}:log-group:/aws/lambda/${functionName}*`)
                    }
                ]
            }
        });
    }
    relativeRootPath(path) {
        return path_1.join(process.cwd(), "..", path);
    }
    lowerCase(str) {
        return str.toString().toLocaleLowerCase();
    }
}
exports.LambdaFunction = LambdaFunction;
//# sourceMappingURL=LambdaFunction.js.map