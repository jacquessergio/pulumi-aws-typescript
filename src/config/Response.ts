'use strict'

import * as aws from "@pulumi/aws";

export class Response {

    private resource: any;

    constructor(resource: any) {
        this.resource = resource;
    }

    public async execute() {
        this.unauthorized();
        this.accessDenied();
        this.default4XX();
        this.default5XX();
    }

    private unauthorized(): void {
        this.template("UNAUTHORIZED", "401", "Invalid or expired token");
    }
    private accessDenied(): void {
        this.template("ACCESS_DENIED", "401");
    }
    private default4XX(): void {
        this.template("DEFAULT_4XX");
    }
    private default5XX(): void {
        this.template("DEFAULT_5XX");
    }

    private template(responseType: string, statusCode?: string, message?: any) {

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

    private getResponseParameters(): any {

        return {
            "gatewayresponse.header.Access-Control-Allow-Headers": "'access-control-allow-origin,authorization,content-type,x-change-password-token,x-refresh-session'",
            "gatewayresponse.header.Access-Control-Allow-Methods": "'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH'",
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Credentials": "'true'"
        }
    }
}