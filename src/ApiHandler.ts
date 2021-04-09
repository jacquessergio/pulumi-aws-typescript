'use strict'

import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { ApiAuthorizer } from "./config/Authorizer";
import { APIDao } from "./dao/APIDao"

export class ApiHandler {

    private apiName: string;
    private authorizer: any;
    private eventHandler: any;
    private revisionId: string;

    constructor(config: any) {
        this.apiName = config.apiName;
        this.revisionId = config.revisionId;
        this.authorizer = this.getAuthorizer(config.authorization);
        this.eventHandler = this.getEventHandler(config.eventHanlder);
    }

    public async execute() {

        let reources: any = [];

        let resourcesFound: Promise<any[] | null> = new APIDao().query(this.revisionId);

        reources = await resourcesFound.then(resource => {

            resource?.forEach(item => {
                let isAuth: boolean = true;

                if (item.auth_scheme == 'None') {
                    isAuth = false;
                }

                reources.push({
                    path: item.api_version + item.url_pattern,
                    method: item.http_method,
                    eventHandler: this.eventHandler,
                    authorizers: (!isAuth) ? [] : this.authorizer,
                    requiredParameters: (isAuth == false) ? [] : [{ name: "Authorization", in: "header" }]
                })
            })
            return reources;
        })


        let apiResponse = new awsx.apigateway.API(this.apiName, {
            requestValidator: 'PARAMS_ONLY',
            routes: reources,
        });

        return apiResponse.url;
    }

    private getAuthorizer(authorizerName: string) {
        return new ApiAuthorizer(authorizerName).get();
    }

    private getEventHandler(lambdaName: string): any {
        return aws.lambda.Function.get(lambdaName, lambdaName);
    }


}