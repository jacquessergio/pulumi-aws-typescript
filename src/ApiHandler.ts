'use strict'

import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { ApiAuthorizer } from "./config/Authorizer";
import { APIDao } from "./dao/APIDao";
import { CustomDomain } from "./config/CustomDomain";
import { Response } from "./config/Response"
import { CORS } from "./config/CORS"
import { API } from '@pulumi/awsx/apigateway';
import { LambdaFunction } from './config/LambdaFunction'
import { Function } from '@pulumi/aws/lambda';
import {proxy} from './functions/Handler'

export class ApiHandler {

    private apiName: string;
    private authorizer: any;
    private eventHandler: any;
    private certificateArn: string;
    private apiData: Promise<any[] | null>;
    private environment: any;

    constructor(config: any) {
        this.apiName = config.apiName;
        this.environment = config.environment;
        this.apiData = new APIDao().query(config.revisionId);
        this.certificateArn = config.certificateArn;
        this.authorizer = this.getAuthorizer(config.authorization);
        this.eventHandler = this.createAndGetLambdaFunction(this.getApiData());
    }

    public async execute() {

        const data = await this.getApiData()

        let apiCreated: API = new awsx.apigateway.API(this.apiName, {
            requestValidator: 'PARAMS_ONLY',
            routes: await this.getRoutesTemplate(),
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
    }


    private getRoutesTemplate() {
        let reources: any = [];
        return this.apiData.then(resource => {
            resource?.forEach(item => {
                let isAuth: boolean = true;

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
                })
            })
            return reources;
        })
    }


    private getApiData(): any {
        return this.apiData.then((result: any) => {
            let data: any = result[0];
            return {
                host: data.vhost,
                name: data.api_name,
                environment: data.label,
                basePath: data.context_template
            }
        });
    }
    private getPathFromResources(): any {
        return this.apiData.then((result: any) => {
            let reources: any = [];
            result.forEach((resource: any) => {
                reources.push({
                    path: resource.api_version + resource.url_pattern
                })
            });
            return reources;
        });
    }



    private async setApiConfig(apiCreated: API, apiData: any) {
        this.setConfigGatewayResponse(apiCreated);
        this.setCustomDomain(apiData.host, apiCreated, apiData.basePath)
        this.setConfigCORS(apiCreated);
    }

    private async setConfigCORS(apiResponse: API) {
        const cors: CORS = new CORS(apiResponse);
        const paths: any[] = await this.getPathFromResources();
        paths.forEach(item => {
            cors.execute(item.path)
        })
    }

    private setConfigGatewayResponse(api: any): void {
        new Response(api).execute();
    }

    private setCustomDomain(url: string, api: any, basePath: string): void {
        new CustomDomain(url, api, basePath.replace('/', ''), this.certificateArn).execute();
    }

    private getAuthorizer(authorizerName: string) {
        return new ApiAuthorizer(authorizerName).get();
    }

    private getEventHandler(lambdaName: string): any {
        return aws.lambda.Function.get(lambdaName, lambdaName);
    }

    private createAndGetLambdaFunction(apiData: any): Function {
        let lambda: LambdaFunction = new LambdaFunction(apiData);
        return lambda.execute();
    }


}