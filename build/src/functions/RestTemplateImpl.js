'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestTemplateImpl = void 0;
const Constants_1 = require("./Constants");
const fetch = require('node-fetch');
class RestTemplateImpl {
    constructor(config) {
        this.executeApiCall = () => __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve) => {
                this.execute((err, res) => {
                    console.error(err);
                    resolve(this.buildResponse(res.code, res.data, res.error));
                });
            });
        });
        this.config = config;
    }
    execute(callback) {
        let request;
        let code;
        request = this.toRequest();
        console.log(request.options);
        console.log(`>>> URL: ${request.url}`);
        console.log(`>>> Method:  ${request.options.method}`);
        fetch(request.url, request.options)
            .then((res) => res)
            .then((res) => code = res)
            .then((res) => this.verifyPayload(res))
            .then((res) => callback(null, { code: code.status, data: res, error: null }))
            .catch((err) => callback(null, { code: Constants_1.Constants.INTERNAL_SERVER_ERROR, data: null, error: err }));
    }
    toRequest() {
        let headers = JSON.stringify(this.config.getHeaders).replace('Host', 'origin');
        if (this.config.getHttpMethod == 'GET' || this.config.getHttpMethod == 'HEAD') {
            return {
                url: this.config.getUri,
                options: {
                    method: this.config.getHttpMethod,
                    headers: JSON.parse(headers)
                }
            };
        }
        else {
            return {
                url: this.config.getUri,
                options: {
                    method: this.config.getHttpMethod,
                    body: (this.config.getBody != null) ? this.config.getBody : {},
                    headers: JSON.parse(headers)
                }
            };
        }
    }
    buildResponse(statusCode, data, error) {
        try {
            console.log(`statusCode: ${statusCode}, body: ${data}, error: ${error}`);
            let code = statusCode;
            let body = (data) ? data : {};
            if (!this.statusCodeIsValid(code) || error) {
                code = Constants_1.Constants.INTERNAL_SERVER_ERROR;
                body = (error) ? error : {};
            }
            return { statusCode: code, responseBody: body };
        }
        catch (e) {
            throw new Error(e);
        }
    }
    verifyPayload(event) {
        return new Promise((resolve) => {
            event.json().then((result) => {
                resolve(result);
            }).catch((err) => {
                console.log(`error: ${err}`);
                resolve(undefined);
            });
        });
    }
    statusCodeIsValid(statusCode) {
        return (statusCode.toString().search(Constants_1.Constants.RGX_ONLY_NUMBER) >= Constants_1.Constants.IS_VALID_CODE);
    }
}
exports.RestTemplateImpl = RestTemplateImpl;
//# sourceMappingURL=RestTemplateImpl.js.map