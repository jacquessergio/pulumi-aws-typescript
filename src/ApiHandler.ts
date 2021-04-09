'use strict'

import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';


import { ApiAuthorizer } from "./config/Authorizer";

export class ApiHandler {

    private apiName: string;
    private authorizer: any;
    private lambdaName: string;

    constructor(config: any) {
        this.apiName = config.require("api_name");
        this.authorizer = config.require("lambda_authorization");
        this.lambdaName = config.require("lambda_execution_name");
    }

    public execute(): any {

        let authorizer = new ApiAuthorizer(this.authorizer);

        let apiResponse = new awsx.apigateway.API(this.apiName, {
            requestValidator: 'PARAMS_ONLY',
            routes: [
                {
                    path: "/",
                    method: "GET",
                    eventHandler: this.getEventHandler(),
                    authorizers: authorizer.get(),
                    requiredParameters: [{ name: "Authorization", in: "header" }]
                }
            ],
        });
       
        return apiResponse;
    }

    private getEventHandler(): any {
        return aws.lambda.Function.get(this.lambdaName, this.lambdaName);
    }

   
}