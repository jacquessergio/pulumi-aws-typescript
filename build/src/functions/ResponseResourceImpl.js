'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseResourceImpl = void 0;
class ResponseResourceImpl {
    responseOK(data) {
        return this.templateResponseApiGateway(data);
    }
    responseError(data) {
        return this.templateResponseApiGateway(data);
    }
    templateResponseApiGateway(data) {
        return {
            "statusCode": data.getStatusCode,
            "body": JSON.stringify(data.getBody),
            "headers": {
                "Access-Control-Allow-Headers": "access-control-allow-origin,authorization,content-type,x-change-password-token,x-refresh-session,company",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,HEAD,OPTIONS,PATCH",
                "Access-Control-Allow-Credentials": true
            },
            "isBase64Encoded": false
        };
    }
}
exports.ResponseResourceImpl = ResponseResourceImpl;
//# sourceMappingURL=ResponseResourceImpl.js.map