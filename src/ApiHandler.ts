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
import { ApiUtils as api } from './utils/ApiUtils'
import { Function } from '@pulumi/aws/lambda';
import { proxy } from './functions/Handler'


export class ApiHandler {

    private apiName: string;
    private authorizer: any;
    private eventHandler: any;
    private certificateArn: string;
    private apiData: Promise<any[] | null>;
    private environment: string;
    private vhost: string;

    constructor(config: any) {
        this.vhost = config.vhost;
        this.apiName = config.apiName;
        this.environment = config.environment;
        this.apiData = new APIDao().query(config.revisionId);
        this.certificateArn = config.certificateArn;
        this.authorizer = this.getAuthorizer(config.authorization);
    }

    public async execute() {

        

        let apiCreated: API = new awsx.apigateway.API(`${this.apiName}`, {
            requestValidator: 'PARAMS_ONLY',
            routes: await this.getRoutesTemplate(),
            stageName: this.environment,
            restApiArgs: {
                description: `Description for api ${this.apiName}`,
                endpointConfiguration: {
                    types: 'REGIONAL'
                }
            }

        });
        this.setApiConfig(apiCreated);

        return apiCreated.urn;
    }


    private async getRoutesTemplate() {
        let resources: any = [];

        this.eventHandler = await this.createAndGetLambdaFunction();

        return this.apiData.then(resource => {
            resource?.forEach(item => {
                let isAuth: boolean = true;

                if (item.auth_scheme == 'None') {
                    isAuth = false;
                }
                const path = api.buildPath(item);

                resources.push({
                    path: path,
                    method: item.http_method,
                    eventHandler: this.eventHandler,
                    authorizers: (!isAuth) ? [] : this.authorizer,
                    requiredParameters: (isAuth == false) ? [] : [{ name: "Authorization", in: "header" }]
                })
            })

            return resources;
        })
    }


    private getApiData(): any {
        return this.apiData.then((result: any) => {
            let data: any = result[0];
            return {
                host: this.vhost,
                name: this.apiName,
                environment: this.environment,
                basePath: data.context_template
            }
        });
    }
    private getPathFromResources(): any {
        return this.apiData.then((result: any) => {
            let reources: any = [];
            result.forEach((resource: any) => {
                reources.push(api.buildPath(resource.url_pattern))
            });
            return reources;
        });
    }



    private async setApiConfig(apiCreated: API) {
        const apiData = await this.getApiData()
        this.setConfigGatewayResponse(apiCreated);
        this.setCustomDomain(apiData, apiCreated)
        this.setConfigCORS(apiCreated);
    }

    private async setConfigCORS(apiResponse: API) {
        const cors: CORS = new CORS(apiResponse);
        const paths: any[] = await this.getPathFromResources();
        const resources = [...new Set(paths)]
        resources.forEach((path: string) => {
            cors.execute(path)
        })
    }

    private setConfigGatewayResponse(api: any): void {
        new Response(api).execute();
    }

    private setCustomDomain(apiData: any, apiCreated: any): void {
        new CustomDomain(apiData.name, apiData.host, apiCreated, apiData.basePath.replace('/', ''), this.certificateArn, this.environment).execute();
    }

    private getAuthorizer(authorizerName: string) {
        return new ApiAuthorizer(authorizerName).get();
    }

    private getEventHandler(lambdaName: string): any {
        return aws.lambda.Function.get(lambdaName, lambdaName);
    }

    private async createAndGetLambdaFunction() {
        let lambda: LambdaFunction = new LambdaFunction(await this.getApiData());
        return lambda.execute();
    }


}