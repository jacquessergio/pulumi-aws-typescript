'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseApi = void 0;
class ResponseApi {
    constructor(statusCode, body) {
        this.statusCode = statusCode;
        this.body = body;
    }
    get getBody() {
        return this.body;
    }
    get getStatusCode() {
        return this.statusCode;
    }
}
exports.ResponseApi = ResponseApi;
//# sourceMappingURL=ResponseApi.js.map