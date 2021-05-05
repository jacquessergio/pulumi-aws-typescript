
'use strict'

import * as aws from '@pulumi/aws';
import { API } from '@pulumi/awsx/apigateway';

export class CORS {

    private restApiId: any;

    constructor(api: API) {
        this.restApiId = api.restAPI.id;
    }

    private buildApiMethodName(path: any) {
        return this.replaceAll(this.replaceAll(path, '/', '-'), '[^a-zA-Z0-9-]+', '');
    }

    public execute(path: any) {
        const name = this.buildApiMethodName(path);
        const resource = this.restApiId.apply((resolvedId: any) =>
            aws.apigateway.getResource({
                path: path,
                restApiId: resolvedId,
            }),
        );

        const method = new aws.apigateway.Method(`api-method-${name}`, {
            authorization: "NONE",
            httpMethod: "OPTIONS",
            resourceId: resource.id,
            restApi: this.restApiId,
        })

        const integration = new aws.apigateway.Integration(
            `api-integration-${name}`,
            {
                httpMethod: method.httpMethod,
                resourceId: resource.id,
                restApi: this.restApiId,
                type: "MOCK",
                requestTemplates: {
                    "application/json": `{ statusCode: 200 }`,
                },
            },
            { dependsOn: method },
        );

        const response200 = new aws.apigateway.MethodResponse(
            `api-response-200-${name}`,
            {
                httpMethod: method.httpMethod,
                resourceId: resource.id,
                restApi: this.restApiId,
                statusCode: "200",
                responseParameters: {
                    "method.response.header.Access-Control-Allow-Origin": true,
                    "method.response.header.Access-Control-Allow-Methods": true,
                    "method.response.header.Access-Control-Allow-Headers": true,
                },
            },
            { dependsOn: integration },
        );

        new aws.apigateway.IntegrationResponse(
            `api-integration-response-${name}`,
            {
                httpMethod: method.httpMethod,
                resourceId: resource.id,
                responseTemplates: { "application/json": `{}` },
                responseParameters: {
                    "method.response.header.Access-Control-Allow-Origin": "'*'",
                    "method.response.header.Access-Control-Allow-Methods": "'*'",
                    "method.response.header.Access-Control-Allow-Headers": "'*'",
                },
                restApi: this.restApiId,
                statusCode: response200.statusCode,
            },
            { dependsOn: response200 },
        );

    }

    private replaceAll(str: string, find: string, replace: string) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

}