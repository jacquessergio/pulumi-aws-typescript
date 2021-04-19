'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
class Model {
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
exports.Model = Model;
//# sourceMappingURL=Model.js.map