'use strict'


import * as aws from '@pulumi/aws';
import { Role } from '@pulumi/aws/iam';
import { Function } from '@pulumi/aws/lambda';
import * as pulumi from "@pulumi/pulumi"
import { join } from 'path';

export class LambdaFunction {

    private apiName: string;
    private environment: string;
    private baseUrl: string;

    constructor(apiData: any) {
        this.apiName = this.lowerCase(apiData.name);
        this.baseUrl = this.lowerCase(apiData.host);
        this.environment = this.lowerCase(apiData.environment);
    }


    public execute(): Function {

        const createTodoFunctionName = `proxy-${this.apiName}-${this.environment}-function`

        /**
         * Code Archive & Lambda layer
         */
        const code = new pulumi.asset.AssetArchive({
            ".": new pulumi.asset.FileArchive(this.relativeRootPath("build/archive.zip"))
        })

        const zipFile = this.relativeRootPath("layers/archive.zip")

        const nodeModuleLambdaLayerName = `${createTodoFunctionName}-layer-nodemodules`

        const nodeModuleLambdaLayer = new aws.lambda.LayerVersion(
            nodeModuleLambdaLayerName,
            {
                compatibleRuntimes: [aws.lambda.NodeJS12dXRuntime],
                code: new pulumi.asset.FileArchive(zipFile),
                layerName: nodeModuleLambdaLayerName
            }
        )

        return new aws.lambda.Function(createTodoFunctionName, {
            name: createTodoFunctionName,
            runtime: aws.lambda.NodeJS12dXRuntime,
            handler: './src/functions/Handler.proxy',
            role: this.createAndGetRole(createTodoFunctionName).arn,
            code,
            memorySize: 1024,
            layers: [nodeModuleLambdaLayer.arn],
            environment: {
                variables:
                {
                    stage: `${this.environment}`,
                    base_url: `${this.baseUrl}`
                }

            },
            tags: {
                Name: `${createTodoFunctionName}`,
                Environment: `${this.environment}`
            }
        })
    }


    private createAndGetRole(functionName: string): Role {

        const executionRoleName = `${this.apiName}-role`;

        const executionRole = new aws.iam.Role(executionRoleName, {
            name: executionRoleName,
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: "lambda.amazonaws.com"
            }),
            tags: {
                Environment: `${this.environment}`,
            }
        })

        this.createPolicy(executionRoleName, executionRole, functionName)

        return executionRole;

    }


    private createPolicy(executionRoleName: string, executionRole: Role, functionName: string): void {

        const account = pulumi.output(aws.getCallerIdentity({ async: true })).accountId

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
                        Resource: account.apply(
                            (accountId) =>
                                `arn:aws:logs:${aws.config.region}:${accountId}:log-group:/aws/lambda/${functionName}*`
                        )
                    }
                ]
            }
        })

    }


    relativeRootPath(path: string) {
        return join(process.cwd(), "..", path)
    }

    private lowerCase(str: string): string {
        return str.toString().toLocaleLowerCase();
    }


}