'use strict'

import * as aws from '@pulumi/aws';

export class ApiAuthorizer {

    private lambdaName: string;

    constructor(lambdaName: string) {
        this.lambdaName = lambdaName;
    }

    public get(): any {

        return [{
            authorizerName: "keycloak_authorizer",
            parameterName: "Authorization",
            parameterLocation: "header",
            authType: "custom",
            type: "token",
            handler: {
                // Use aws.lambda.Function.get to look up an existing Lambda Function. The library
                // will automatically fetch the invoke URI to pass to the Authorizer.
                uri: aws.lambda.Function.get(this.lambdaName, this.lambdaName),
                credentials: "arn:aws:iam::001849918413:role/api_gateway_auth_invocation",
            },
            identitySource: ["method.request.header.Authorization"],
            // remover cache de 5 minutos
        }]

    }
}