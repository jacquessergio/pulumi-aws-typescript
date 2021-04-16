'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS = void 0;
const aws = require("@pulumi/aws");
class CORS {
    constructor(api) {
        this.restApiId = api.restAPI.id;
    }
    execute(path) {
        const name = path.replace('/', '-');
        const resource = this.restApiId.apply((resolvedId) => aws.apigateway.getResource({
            path: '/' + path,
            restApiId: resolvedId,
        }));
        const method = new aws.apigateway.Method(`api-method-${name}`, {
            authorization: "NONE",
            httpMethod: "OPTIONS",
            resourceId: resource.id,
            restApi: this.restApiId,
        });
        const integration = new aws.apigateway.Integration(`api-integration-${name}`, {
            httpMethod: method.httpMethod,
            resourceId: resource.id,
            restApi: this.restApiId,
            type: "MOCK",
            requestTemplates: {
                "application/json": `{ statusCode: 200 }`,
            },
        }, { dependsOn: method });
        const response200 = new aws.apigateway.MethodResponse(`api-response-200-${name}`, {
            httpMethod: method.httpMethod,
            resourceId: resource.id,
            restApi: this.restApiId,
            statusCode: "200",
            responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": true,
                "method.response.header.Access-Control-Allow-Methods": true,
                "method.response.header.Access-Control-Allow-Headers": true,
            },
        }, { dependsOn: integration });
        new aws.apigateway.IntegrationResponse(`api-integration-response-${name}`, {
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
        }, { dependsOn: response200 });
    }
}
exports.CORS = CORS;
//# sourceMappingURL=CORS.js.map