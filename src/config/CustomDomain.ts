import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { input } from "@pulumi/aws/types";

export class CustomDomain {

    private apiName: string;
    private domain: string;
    private resource: any;
    private basePath: string;
    private environment: string;
    private certificateArn: string;

    constructor(apiName: string, domain: string, resource: any, basePath: string, certificateArn: string, environment: string) {
        this.apiName = apiName;
        this.domain = domain;
        this.resource = resource;
        this.basePath = basePath;
        this.environment = environment;
        this.certificateArn = certificateArn;
    }

    public execute() {

        const webDomain = aws.apigatewayv2.DomainName.get(`gw-custom-domain-${this.environment}`, this.domain);

        const webDomainMapping = new aws.apigateway.BasePathMapping(`${this.apiName}-domain-mapping`, {
            restApi: this.resource.restAPI,
            stageName: this.resource.stage.stageName,
            basePath: this.basePath,
            domainName: webDomain.id,
        });

    }
}