import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { input } from "@pulumi/aws/types";

export class CustomDomain {

    private apiName: string;
    private domain: string;
    private resource: any;
    private basePath: string;
    private certificateArn: string;

    constructor(apiName: string, domain: string, resource: any, basePath: string, certificateArn: string) {
        this.apiName = apiName;
        this.domain = domain;
        this.resource = resource;
        this.basePath = basePath;
        this.certificateArn = certificateArn;
    }

    public execute() {

        /*const webDnsZone = new aws.route53.Zone("webDnsZone", {
            name: this.domain
        })*/

        //// Provision an SSL certificate to enable SSL -- ensuring to do so in us-east-1.
        //const awsUsEast1 = new aws.Provider("usEast1", { region: "us-east-1" })

        /*const sslCert = new aws.acm.Certificate("sslCert", {
            domainName: this.domain,
            validationMethod: "DNS"
        }, { provider: awsUsEast1 })
        */

        // Create the necessary DNS records for ACM to validate ownership, and wait for it.
        //const sslCertValidationRecord = new aws.route53.Record("sslCertValidationRecord", {
        //  zoneId: webDnsZone.id,
        //  name: sslCert.domainValidationOptions[0].resourceRecordName,
        //  type: sslCert.domainValidationOptions[0].resourceRecordType,
        //  records: [sslCert.domainValidationOptions[0].resourceRecordValue],
        //  ttl: 10 * 60 /* 10 minutes */,
        //});
        /*
        const sslCertValidationIssued = new aws.acm.CertificateValidation("sslCertValidationIssued", {
            certificateArn: sslCert.arn,
            validationRecordFqdns: [sslCertValidationRecord.fqdn],
        }, { provider: awsUsEast1 });
        */


        // Configure an edge-optimized domain for our API Gateway. This will configure a Cloudfront CDN
        // distribution behind the scenes and serve our API Gateway at a custom domain name over SSL.
        const webDomain = new aws.apigatewayv2.DomainName("webCdn", {
            //certificateArn: sslCertValidationIssued.certificateArn,

            domainName: this.domain,
            domainNameConfiguration: {
                certificateArn: this.certificateArn,
                endpointType: "REGIONAL",
                securityPolicy: "TLS_1_2",
            },
        });

        const webDomainMapping = new aws.apigateway.BasePathMapping(`${this.apiName}-domain-mapping`, {
            restApi: this.resource.restAPI,
            stageName: this.resource.stage.stageName,
            basePath: this.basePath,
            domainName: webDomain.id,
        });

        /*
        const webDnsRecord = new aws.route53.Record("webDnsRecord", {
            name: webDomain.domainName,
            type: "A",
            zoneId: webDnsZone.id,
            aliases: [{
                evaluateTargetHealth: true,
                name: webDomain.cloudfrontDomainName,
                zoneId: webDomain.cloudfrontZoneId,
            }],
        }, { dependsOn: webDomain });
        */
    }
}