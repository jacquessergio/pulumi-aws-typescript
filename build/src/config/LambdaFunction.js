'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFunction = void 0;
const aws = require("@pulumi/aws");
const pulumi = require("@pulumi/pulumi");
const path_1 = require("path");
class LambdaFunction {
    constructor(apiName, environment) {
        this.apiName = this.lowerCase(apiName);
        this.environment = this.lowerCase(environment);
    }
    execute() {
        const account = pulumi.output(aws.getCallerIdentity({ async: true })).accountId;
        const createTodoFunctionName = `proxy-${this.apiName}-${this.environment}-function`;
        /**
         * IAM Role
         */
        const executionRoleName = `${this.apiName}-role`;
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
            ".": new pulumi.asset.FileArchive("build/archive.zip")
        });
        const zipFile = "layers/archive.zip";
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
            role: executionRole.arn,
            code,
            memorySize: 128,
            layers: [nodeModuleLambdaLayer.arn],
        });
    }
    relativeRootPath(path) {
        return path_1.join(process.cwd(), "..", path);
    }
    lowerCase(str) {
        return str.toLowerCase();
    }
}
exports.LambdaFunction = LambdaFunction;
//# sourceMappingURL=LambdaFunction.js.map