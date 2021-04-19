'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    constructor(params, uri) {
        this.path = params.path;
        this.uri = uri;
        this.headers = params.headers;
        this.httpMethod = params.httpMethod;
        this.body = params.body;
        this.resource = params.resource;
        this.queryStringParameters = params.queryStringParameters;
        this.multiValueHeaders = params.multiValueHeaders;
        this.multiValueQueryStringParameters = params.multiValueQueryStringParameters;
    }
    get getPath() {
        return this.path;
    }
    set setPath(path) {
        this.path = path;
    }
    get getUri() {
        return this.uri;
    }
    set setUri(uri) {
        this.uri = uri;
    }
    get getHeaders() {
        return this.headers;
    }
    get getHttpMethod() {
        return this.httpMethod;
    }
    get getBody() {
        return this.body;
    }
    get getResource() {
        return this.resource;
    }
    get getQueryStringParameters() {
        return this.queryStringParameters;
    }
    get getMultiValueHeaders() {
        return this.multiValueHeaders;
    }
    get getMultiValueQueryStringParameters() {
        return this.multiValueQueryStringParameters;
    }
}
exports.Config = Config;
//# sourceMappingURL=Config.js.map